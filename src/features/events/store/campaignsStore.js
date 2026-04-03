import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { createCampaignRow, deleteCampaignRow, isSupabaseConfigured, listCampaignRows, updateCampaignRow } from '../api';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ensurePersistedStoreSchemaVersion } from '@/shared/utils/ensurePersistedStoreSchemaVersion';
import { notifyError } from '@/core/services/toastService';

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

const getCampaignSyncErrorMessage = (error, fallbackMessage) => {
  const message = String(error?.message || '').toLowerCase();

  if (message.includes('row-level security') || message.includes('permission denied')) {
    return 'A campanha foi guardada apenas neste dispositivo. Entre com uma conta admin do Supabase para sincronizar.';
  }

  if (message.includes('jwt') || message.includes('token')) {
    return 'A sessao atual nao conseguiu autorizar a sincronizacao da campanha no Supabase.';
  }

  return fallbackMessage;
};

const reportCampaignError = (message, id, title = 'Falha ao sincronizar campanhas') => {
  notifyError(message, { id: `campaigns-${id}`, title });
};

export const useCampaignsStore = defineStore('campaigns', () => {
  ensurePersistedStoreSchemaVersion();
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

  const getSupabaseAuthOptions = () => {
    const authStore = useAuthStore();
    return authStore.accessToken ? { accessToken: authStore.accessToken } : null;
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
      const authOptions = getSupabaseAuthOptions() || {};
      const rows = await listCampaignRows(authOptions);
      const remoteCampaigns = Array.isArray(rows)
        ? rows
            .map(mapCampaignFromDb)
            .filter((item) => !deletedCampaignIds.value.includes(String(item.id)))
        : [];
      const remoteIds = new Set(remoteCampaigns.map((item) => String(item.id)));
      const localFallback = campaigns.value.filter((item) => {
        const normalizedId = String(item.id);
        if (deletedCampaignIds.value.includes(normalizedId)) return false;
        if (normalizedId.includes('-temp-')) return true;
        return item.status === 'inativo' && !remoteIds.has(normalizedId);
      });
      const localMap = new Map(localFallback.map((item) => [item.id, item]));
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
      reportCampaignError(lastSyncError.value, 'refresh');
      console.warn('Falha ao carregar campanhas do Supabase:', error);
      return false;
    }
  };

  const addCampaign = async (campaign) => {
    const localRecord = normalizeCampaign({
      id: `camp-temp-${Date.now()}`,
      status: 'ativo',
      ...campaign
    });
    campaigns.value.unshift(localRecord);
    lastSyncError.value = '';

    if (!isSupabaseConfigured) {
      syncSource.value = 'local';
      return { ok: true, source: 'local', campaign: localRecord };
    }

    const authOptions = getSupabaseAuthOptions();
    if (!authOptions?.accessToken) {
      syncSource.value = 'local';
      return { ok: true, source: 'local', campaign: localRecord };
    }

    try {
      const rows = await createCampaignRow(mapCampaignToDb(localRecord), authOptions);
      const created = Array.isArray(rows) ? rows[0] : null;
      if (created) {
        replaceLocalCampaign(localRecord.id, mapCampaignFromDb(created));
      }
      syncSource.value = 'supabase';
      lastSyncError.value = '';
      return {
        ok: true,
        source: 'supabase',
        campaign: created ? mapCampaignFromDb(created) : localRecord
      };
    } catch (error) {
      syncSource.value = 'local';
      lastSyncError.value = getCampaignSyncErrorMessage(error, 'Falha ao enviar campanha para o Supabase.');
      reportCampaignError(lastSyncError.value, 'create', 'Falha ao criar campanha');
      console.warn('Falha ao criar campanha no Supabase:', error);
      return { ok: false, source: 'local', campaign: localRecord, error };
    }
  };

  const toggleStatus = (id) => {
    const target = campaigns.value.find((item) => item.id === id);
    if (!target) return;
    const previousStatus = target.status;
    const nextStatus = target.status === 'ativo' ? 'inativo' : 'ativo';
    target.status = nextStatus;
    lastSyncError.value = '';

    const authOptions = getSupabaseAuthOptions();
    if (isSupabaseConfigured && authOptions?.accessToken && !String(id).includes('-temp-')) {
      updateCampaignRow(id, { status: nextStatus }, authOptions)
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          target.status = previousStatus;
          lastSyncError.value = getCampaignSyncErrorMessage(error, 'Falha ao atualizar campanha no Supabase.');
          reportCampaignError(lastSyncError.value, 'toggle', 'Falha ao atualizar campanha');
          console.warn('Falha ao atualizar status da campanha no Supabase:', error);
        });
    }
  };

  const removeCampaign = (id) => {
    const normalizedId = String(id);
    campaigns.value = campaigns.value.filter((item) => item.id !== id);
    lastSyncError.value = '';
    if (!String(id).includes('-temp-')) {
      rememberDeletedCampaign(normalizedId);
    }

    const authOptions = getSupabaseAuthOptions();
    if (isSupabaseConfigured && authOptions?.accessToken && !String(id).includes('-temp-')) {
      deleteCampaignRow(id, authOptions)
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          syncSource.value = 'local';
          lastSyncError.value = getCampaignSyncErrorMessage(error, 'Campanha removida localmente, mas a exclusao no Supabase falhou.');
          reportCampaignError(lastSyncError.value, 'remove', 'Falha ao remover campanha');
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
