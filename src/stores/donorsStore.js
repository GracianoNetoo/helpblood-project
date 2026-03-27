import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { isSupabaseConfigured, selectRows } from '../lib/supabaseClient';

const STORAGE_KEY = 'univida_donors';
const SHOULD_USE_SEED_DONORS = import.meta.env.DEV;

const seedDonors = [
  {
    id: '1',
    nome: 'Manuel Francisco',
    tipo_sanguineo: 'O+',
    rh: 'Positivo (+)',
    provincia: 'Luanda',
    municipio: 'Talatona',
    telefone: '923000000',
    email: 'manuel@example.com',
    doacao_sangue: 'Sim, ja doei',
    lastDonationLiters: null,
    lastDonationDate: null,
    lastDonationCampaignId: null,
    lastDonationCampaignTitle: null,
    lastDonationCampaignLocation: null,
    donationHistory: [],
    totalDonationLiters: 0,
    status: 'ativo',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Helena Sousa',
    tipo_sanguineo: 'A+',
    rh: 'Positivo (+)',
    provincia: 'Benguela',
    municipio: 'Lobito',
    telefone: '912000000',
    email: 'helena@example.com',
    doacao_sangue: 'Nao, sera a 1a vez',
    lastDonationLiters: null,
    lastDonationDate: null,
    lastDonationCampaignId: null,
    lastDonationCampaignTitle: null,
    lastDonationCampaignLocation: null,
    donationHistory: [],
    totalDonationLiters: 0,
    status: 'ativo',
    createdAt: new Date().toISOString()
  }
];

const seedDonorIds = new Set(seedDonors.map((donor) => String(donor.id)));

const normalizeDonor = (item) => ({
  id: item?.id ? String(item.id) : String(Date.now()),
  nome: item?.nome ?? '',
  tipo_sanguineo: item?.tipo_sanguineo ?? '',
  rh: item?.rh ?? '',
  provincia: item?.provincia ?? '',
  municipio: item?.municipio ?? '',
  telefone: item?.telefone ?? '',
  email: item?.email ?? '',
  doacao_sangue: item?.doacao_sangue ?? '',
  lastDonationLiters: item?.lastDonationLiters ?? null,
  lastDonationDate: item?.lastDonationDate ?? null,
  lastDonationCampaignId: item?.lastDonationCampaignId ?? null,
  lastDonationCampaignTitle: item?.lastDonationCampaignTitle ?? null,
  lastDonationCampaignLocation: item?.lastDonationCampaignLocation ?? null,
  donationHistory: Array.isArray(item?.donationHistory) ? item.donationHistory : [],
  totalDonationLiters: Number(item?.totalDonationLiters || 0),
  status: item?.status ?? 'ativo',
  createdAt: item?.createdAt ?? new Date().toISOString()
});

const isSeedDonor = (donor) => seedDonorIds.has(String(donor?.id));

const mapProfileFromDb = (row) => normalizeDonor({
  id: row?.id,
  nome: row?.nome,
  tipo_sanguineo: row?.tipo_sanguineo,
  rh: row?.rh,
  provincia: row?.provincia,
  municipio: row?.municipio,
  telefone: row?.telefone,
  email: row?.email,
  doacao_sangue: row?.doacao_sangue,
  lastDonationLiters: row?.last_donation_liters,
  lastDonationDate: row?.last_donation_date,
  lastDonationCampaignId: row?.last_donation_campaign_id,
  lastDonationCampaignTitle: row?.last_donation_campaign_title,
  lastDonationCampaignLocation: row?.last_donation_campaign_location,
  totalDonationLiters: row?.total_donation_liters,
  status: row?.status,
  createdAt: row?.created_at
});

export const useDonorsStore = defineStore('donors', () => {
  const donors = ref(SHOULD_USE_SEED_DONORS ? [...seedDonors].map(normalizeDonor) : []);
  const lastSyncError = ref('');

  const saveToStorage = (value) => {
    try {
      const sanitizedValue = SHOULD_USE_SEED_DONORS ? value : value.filter((item) => !isSeedDonor(item));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedValue));
    } catch (error) {
      console.warn('Falha ao salvar doadores:', error);
    }
  };

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(normalizeDonor);
          donors.value = SHOULD_USE_SEED_DONORS ? normalized : normalized.filter((item) => !isSeedDonor(item));
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar doadores:', error);
    }
  };

  const upsertDonor = (donor) => {
    const normalized = normalizeDonor(donor);
    const index = donors.value.findIndex((item) => String(item.id) === String(normalized.id));
    if (index === -1) {
      donors.value.unshift(normalized);
    } else {
      donors.value[index] = normalized;
    }
    return normalized;
  };

  const addDonor = (donor) => {
    return upsertDonor({
      id: `local-${Date.now()}`,
      status: 'ativo',
      createdAt: new Date().toISOString(),
      ...donor
    });
  };

  const toggleStatus = (id) => {
    const target = donors.value.find((item) => String(item.id) === String(id));
    if (!target) return;
    target.status = target.status === 'ativo' ? 'suspenso' : 'ativo';
  };

  const removeDonor = (id) => {
    donors.value = donors.value.filter((item) => String(item.id) !== String(id));
  };

  const updateLastDonationLiters = (id, liters, campaign = null) => {
    const target = donors.value.find((item) => String(item.id) === String(id));
    if (!target) return;
    if (liters === '' || liters === null || typeof liters === 'undefined') {
      target.lastDonationLiters = null;
      target.lastDonationDate = null;
      target.lastDonationCampaignId = null;
      target.lastDonationCampaignTitle = null;
      target.lastDonationCampaignLocation = null;
      return;
    }

    const normalized = typeof liters === 'string' ? liters.replace(',', '.') : liters;
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) return;

    const currentTotal = Number(target.totalDonationLiters) || 0;
    const donationDate = new Date().toISOString().split('T')[0];
    const campaignId = campaign && campaign.id ? campaign.id : null;
    const campaignTitle = campaign && campaign.title ? campaign.title : null;
    const campaignLocation = campaign && campaign.location ? campaign.location : null;
    const history = Array.isArray(target.donationHistory) ? target.donationHistory : [];

    target.lastDonationLiters = parsed;
    target.lastDonationDate = donationDate;
    target.lastDonationCampaignId = campaignId;
    target.lastDonationCampaignTitle = campaignTitle;
    target.lastDonationCampaignLocation = campaignLocation;
    target.totalDonationLiters = Number((currentTotal + parsed).toFixed(2));
    target.donationHistory = [
      {
        id: `don-${Date.now()}`,
        liters: parsed,
        date: donationDate,
        campaignId,
        campaignTitle,
        campaignLocation
      },
      ...history
    ];
  };

  const refreshDonorProfile = async (donorId, accessToken = null) => {
    if (!isSupabaseConfigured || !donorId) return null;
    try {
      const rows = await selectRows('profiles', {
        select: '*',
        id: `eq.${donorId}`
      }, { accessToken });
      const profile = Array.isArray(rows) ? rows[0] : null;
      if (!profile) return null;
      const normalized = mapProfileFromDb(profile);
      upsertDonor(normalized);
      lastSyncError.value = '';
      return normalized;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao sincronizar perfil do doador.';
      console.warn('Falha ao carregar perfil do Supabase:', error);
      return null;
    }
  };

  const refreshAllDonors = async (accessToken = null) => {
    if (!isSupabaseConfigured) return [];
    try {
      const rows = await selectRows('profiles', {
        select: '*',
        order: 'created_at.desc'
      }, { accessToken });
      const remoteDonors = Array.isArray(rows) ? rows.map(mapProfileFromDb) : [];
      const remoteIds = new Set(remoteDonors.map((item) => String(item.id)));
      const localOnly = donors.value.filter((item) => !remoteIds.has(String(item.id)) && String(item.id).startsWith('local-'));
      donors.value = [...remoteDonors, ...localOnly];
      lastSyncError.value = '';
      return donors.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar base de doadores.';
      console.warn('Falha ao carregar doadores do Supabase:', error);
      return donors.value;
    }
  };

  loadFromStorage();

  watch(
    donors,
    (value) => {
      saveToStorage(value);
    },
    { deep: true }
  );

  return {
    donors,
    lastSyncError,
    addDonor,
    upsertDonor,
    toggleStatus,
    removeDonor,
    updateLastDonationLiters,
    refreshDonorProfile,
    refreshAllDonors
  };
});
