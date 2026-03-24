import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { isSupabaseConfigured, insertRows, selectRows, updateRows, deleteRows } from '../lib/supabaseClient';

const STORAGE_KEY = 'univida_campaigns';

const seedCampaigns = [
  {
    id: 'camp-1',
    title: 'Mutirao Nacional: Universidade Agostinho Neto',
    location: 'Luanda',
    dateISO: new Date().toISOString().split('T')[0],
    time: '10:00',
    description: 'Unidade movel em frente a reitoria, com foco na reposicao urgente do banco de sangue central.',
    tags: ['O-', 'A+'],
    highlight: 'Critico',
    status: 'ativo'
  },
  {
    id: 'camp-2',
    title: 'Acao Comunitaria Praia Morena',
    location: 'Benguela',
    dateISO: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '08:00',
    description: 'Postos de triagem e coleta com apoio de voluntarios locais e parceiros comunitarios.',
    tags: ['Todos'],
    highlight: 'Aberto',
    status: 'ativo'
  }
];

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
  const campaigns = ref([...seedCampaigns].map(normalizeCampaign));
  const lastSyncError = ref('');
  const syncSource = ref('local');

  const saveToStorage = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Falha ao salvar campanhas:', error);
    }
  };

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          campaigns.value = parsed.map(normalizeCampaign);
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar campanhas:', error);
    }
  };

  const replaceLocalCampaign = (targetId, nextCampaign) => {
    campaigns.value = campaigns.value.map((item) => (item.id === targetId ? normalizeCampaign(nextCampaign) : item));
  };

  const refreshFromSupabase = async () => {
    if (!isSupabaseConfigured) return false;
    try {
      const rows = await selectRows('campaigns', {
        select: '*',
        order: 'date_iso.asc'
      });
      const remoteCampaigns = Array.isArray(rows) ? rows.map(mapCampaignFromDb) : [];
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
    const snapshot = [...campaigns.value];
    campaigns.value = campaigns.value.filter((item) => item.id !== id);

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      deleteRows('campaigns', { id: `eq.${id}` })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          campaigns.value = snapshot;
          lastSyncError.value = error.message || 'Falha ao remover campanha no Supabase.';
          console.warn('Falha ao remover campanha no Supabase:', error);
        });
    }
  };

  loadFromStorage();
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
    addCampaign,
    toggleStatus,
    removeCampaign,
    refreshFromSupabase
  };
});
