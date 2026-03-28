import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { isSupabaseConfigured, insertRows, selectRows, updateRows, deleteRows } from '../lib/supabaseClient';
import { resetPersistedStoreData } from './resetPersistedStoreData';

const STORAGE_KEY = 'univida_campaigns';
const DELETED_STORAGE_KEY = 'univida_deleted_campaigns';
const SHOULD_USE_SEED_CAMPAIGNS = import.meta.env.DEV;

const seedCampaigns = [];

const seedCampaignIds = new Set(seedCampaigns.map((campaign) => String(campaign.id)));

const normalizeTime = (value) => {
  if (!value) return '';
  return String(value).slice(0, 5);
};

const normalizeCampaign = (campaign) => ({
  id: campaign?.id ?? `camp-${Date.now()}`,
  title: campaign?.title ?? '',
  location: campaign?.location ?? '',
  dateISO: campaign?.dateISO ?? '',
  time: normalizeTime(campaign?.time),
  description: campaign?.description ?? '',
  tags: Array.isArray(campaign?.tags) ? campaign.tags : [],
  highlight: campaign?.highlight ?? 'Aberto',
  status: campaign?.status ?? 'ativo'
});

const isSeedCampaign = (campaign) => seedCampaignIds.has(String(campaign?.id));

const mapCampaignFromDb = (row) => normalizeCampaign({
  id: row?.id,
  title: row?.title,
  location: row?.location,
  dateISO: row?.date_iso,
  time: row?.time_slot,
  description: row?.description,
  tags: row?.tags,
  highlight: row?.highlight === 'critico' ? 'Critico' : 'Aberto',
  status: row?.status ?? 'ativo'
});

const mapCampaignToDb = (campaign) => ({
  title: campaign.title,
  location: campaign.location,
  date_iso: campaign.dateISO,
  time_slot: campaign.time || null,
  description: campaign.description || null,
  tags: Array.isArray(campaign.tags) && campaign.tags.length ? campaign.tags : ['Todos'],
  highlight: String(campaign.highlight || 'Aberto').toLowerCase(),
  status: campaign.status || 'ativo'
});

export const useCampaignsStore = defineStore('campaigns', () => {
  resetPersistedStoreData();
  const campaigns = ref(SHOULD_USE_SEED_CAMPAIGNS ? [...seedCampaigns].map(normalizeCampaign) : []);
  const lastSyncError = ref('');
  const syncSource = ref('local');
  const autoOpenCampaign = ref(false);
  const deletedCampaignIds = ref([]);

  const saveToStorage = (value) => {
    try {
      const sanitizedValue = SHOULD_USE_SEED_CAMPAIGNS ? value : value.filter((item) => !isSeedCampaign(item));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedValue));
    } catch (error) {
      console.warn('Falha ao salvar campanhas:', error);
    }
  };

  const saveDeletedIds = (value) => {
    try {
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Falha ao salvar campanhas removidas:', error);
    }
  };

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(normalizeCampaign);
          campaigns.value = SHOULD_USE_SEED_CAMPAIGNS ? normalized : normalized.filter((item) => !isSeedCampaign(item));
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar campanhas:', error);
    }
  };

  const loadDeletedIds = () => {
    try {
      const raw = localStorage.getItem(DELETED_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        deletedCampaignIds.value = parsed.map((item) => String(item));
      }
    } catch (error) {
      console.warn('Falha ao carregar campanhas removidas:', error);
    }
  };

  const rememberDeletedCampaign = (id) => {
    const normalizedId = String(id);
    if (deletedCampaignIds.value.includes(normalizedId)) return;
    deletedCampaignIds.value = [...deletedCampaignIds.value, normalizedId];
    saveDeletedIds(deletedCampaignIds.value);
  };

  const replaceLocalCampaign = (targetId, nextCampaign) => {
    campaigns.value = campaigns.value.map((item) => (item.id === targetId ? normalizeCampaign(nextCampaign) : item));
  };

  const requestOpenCampaign = () => {
    autoOpenCampaign.value = true;
  };

  const consumeOpenCampaign = () => {
    autoOpenCampaign.value = false;
  };

  const refreshFromSupabase = async () => {
    if (!isSupabaseConfigured) return false;
    try {
      const rows = await selectRows('campaigns', {
        select: '*',
        order: 'date_iso.asc'
      });
      const remoteCampaigns = Array.isArray(rows)
        ? rows
            .map(mapCampaignFromDb)
            .filter((item) => !deletedCampaignIds.value.includes(String(item.id)))
        : [];
      const localInactive = campaigns.value.filter((item) => item.status === 'inativo' && !String(item.id).includes('-temp-'));
      const localMap = new Map(localInactive.map((item) => [item.id, item]));
      remoteCampaigns.forEach((item) => {
        localMap.set(item.id, item);
      });
      campaigns.value = Array.from(localMap.values());
      syncSource.value = 'supabase';
      lastSyncError.value = '';
      saveToStorage(campaigns.value);
      return true;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao sincronizar campanhas.';
      console.warn('Falha ao carregar campanhas do Supabase:', error);
      return false;
    }
  };

  const addCampaign = (campaign) => {
    const localRecord = normalizeCampaign({
      id: `camp-temp-${Date.now()}`,
      status: 'ativo',
      ...campaign
    });
    campaigns.value.unshift(localRecord);

    if (isSupabaseConfigured) {
      insertRows('campaigns', mapCampaignToDb(localRecord))
        .then((rows) => {
          const created = Array.isArray(rows) ? rows[0] : null;
          if (!created) return;
          replaceLocalCampaign(localRecord.id, mapCampaignFromDb(created));
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          lastSyncError.value = error.message || 'Falha ao enviar campanha para o Supabase.';
          console.warn('Falha ao criar campanha no Supabase:', error);
        });
    }

    return localRecord;
  };

  const toggleStatus = (id) => {
    const target = campaigns.value.find((item) => item.id === id);
    if (!target) return;
    const previousStatus = target.status;
    const nextStatus = target.status === 'ativo' ? 'inativo' : 'ativo';
    target.status = nextStatus;

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      updateRows('campaigns', { id: `eq.${id}` }, { status: nextStatus })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          target.status = previousStatus;
          lastSyncError.value = error.message || 'Falha ao atualizar campanha no Supabase.';
          console.warn('Falha ao atualizar status da campanha no Supabase:', error);
        });
    }
  };

  const removeCampaign = (id) => {
    const normalizedId = String(id);
    campaigns.value = campaigns.value.filter((item) => item.id !== id);
    if (!String(id).includes('-temp-')) {
      rememberDeletedCampaign(normalizedId);
    }

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      deleteRows('campaigns', { id: `eq.${id}` })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          syncSource.value = 'local';
          lastSyncError.value = error.message || 'Campanha removida localmente, mas a exclusao no Supabase falhou.';
          console.warn('Falha ao remover campanha no Supabase:', error);
        });
    }
  };

  loadFromStorage();
  loadDeletedIds();
  refreshFromSupabase();

  watch(
    campaigns,
    (value) => {
      saveToStorage(value);
    },
    { deep: true }
  );

  return {
    campaigns,
    lastSyncError,
    syncSource,
    autoOpenCampaign,
    deletedCampaignIds,
    addCampaign,
    toggleStatus,
    removeCampaign,
    refreshFromSupabase,
    requestOpenCampaign,
    consumeOpenCampaign
  };
});
