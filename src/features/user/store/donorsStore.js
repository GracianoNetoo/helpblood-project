import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { getProfileById, isSupabaseConfigured, listProfiles, updateProfileById } from '../api';
import { createDonationRow, listDonationsByDonorId } from '../../donations/api';
import { ensurePersistedStoreSchemaVersion } from '../../../shared/utils/ensurePersistedStoreSchemaVersion';
import { notifyError } from '../../../core/services/toastService';

const STORAGE_KEY = 'univida_donors';
const SHOULD_USE_SEED_DONORS = import.meta.env.DEV;

const seedDonors = [];

const seedDonorIds = new Set(seedDonors.map((donor) => String(donor.id)));

const normalizeDonor = (item) => ({
  id: item?.id ? String(item.id) : String(Date.now()),
  role: item?.role ?? 'donor',
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
  role: row?.role,
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

const mapDonationFromDb = (row) => ({
  id: row?.id ? String(row.id) : `don-${Date.now()}`,
  liters: Number(row?.liters || 0),
  date: row?.donated_at || null,
  campaignId: row?.campaign_id || null,
  campaignTitle: row?.campaign_title_snapshot || null,
  campaignLocation: row?.campaign_location_snapshot || null,
  appointmentId: row?.appointment_id || null,
  recordedBy: row?.recorded_by || null,
  createdAt: row?.created_at || null
});

const reportDonorError = (message, id, title = 'Falha ao sincronizar doadores') => {
  notifyError(message, { id: `donors-${id}`, title });
};

export const useDonorsStore = defineStore('donors', () => {
  ensurePersistedStoreSchemaVersion();
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

  const setDonationHistory = (donorId, history) => {
    const target = donors.value.find((item) => String(item.id) === String(donorId));
    if (!target) return null;
    target.donationHistory = Array.isArray(history) ? history : [];
    return target;
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

  const applyLocalDonationUpdate = (id, liters, campaign = null) => {
    const target = donors.value.find((item) => String(item.id) === String(id));
    if (!target) return null;
    if (liters === '' || liters === null || typeof liters === 'undefined') {
      target.lastDonationLiters = null;
      target.lastDonationDate = null;
      target.lastDonationCampaignId = null;
      target.lastDonationCampaignTitle = null;
      target.lastDonationCampaignLocation = null;
      return target;
    }

    const normalized = typeof liters === 'string' ? liters.replace(',', '.') : liters;
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) return null;

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
    return target;
  };

  const refreshDonationHistory = async (donorId, accessToken = null) => {
    if (!isSupabaseConfigured || !donorId) return [];
    try {
      const rows = await listDonationsByDonorId(donorId, { accessToken });
      const donationHistory = Array.isArray(rows) ? rows.map(mapDonationFromDb) : [];
      setDonationHistory(donorId, donationHistory);
      lastSyncError.value = '';
      return donationHistory;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar historico de doacoes.';
      reportDonorError(lastSyncError.value, 'history', 'Falha ao carregar historico');
      console.warn('Falha ao carregar historico de doacoes:', error);
      return [];
    }
  };

  const updateLastDonationLiters = async (id, liters, campaign = null, options = {}) => {
    const { accessToken = null, recordedBy = null, appointmentId = null } = options;

    if (!isSupabaseConfigured || !accessToken) {
      return applyLocalDonationUpdate(id, liters, campaign);
    }

    const normalized = typeof liters === 'string' ? liters.replace(',', '.') : liters;
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) return null;

    try {
      await createDonationRow(
        {
          donor_id: id,
          campaign_id: campaign?.id || null,
          appointment_id: appointmentId || null,
          liters: parsed,
          donated_at: new Date().toISOString().split('T')[0],
          campaign_title_snapshot: campaign?.title || null,
          campaign_location_snapshot: campaign?.location || null,
          recorded_by: recordedBy || null
        },
        { accessToken }
      );

      const profile = await refreshDonorProfile(id, accessToken);
      await refreshDonationHistory(id, accessToken);
      lastSyncError.value = '';
      return profile || donors.value.find((item) => String(item.id) === String(id)) || null;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao registar a doacao no Supabase.';
      reportDonorError(lastSyncError.value, 'donation', 'Falha ao registar doacao');
      console.warn('Falha ao registar doacao:', error);
      return null;
    }
  };

  const refreshDonorProfile = async (donorId, accessToken = null) => {
    if (!isSupabaseConfigured || !donorId) return null;
    try {
      const rows = await getProfileById(donorId, { accessToken });
      const profile = Array.isArray(rows) ? rows[0] : null;
      if (!profile) return null;
      const currentHistory = donors.value.find((item) => String(item.id) === String(donorId))?.donationHistory || [];
      const normalized = normalizeDonor({
        ...mapProfileFromDb(profile),
        donationHistory: currentHistory
      });
      upsertDonor(normalized);
      lastSyncError.value = '';
      return normalized;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao sincronizar perfil do doador.';
      reportDonorError(lastSyncError.value, 'profile', 'Falha ao carregar perfil');
      console.warn('Falha ao carregar perfil:', error);
      return null;
    }
  };

  const updateDonorProfile = async (donorId, patch, accessToken = null) => {
    if (!isSupabaseConfigured || !donorId) return null;
    try {
      const rows = await updateProfileById(donorId, patch, { accessToken });
      const profile = Array.isArray(rows) ? rows[0] : null;
      if (!profile) return null;
      const currentHistory = donors.value.find((item) => String(item.id) === String(donorId))?.donationHistory || [];
      const normalized = normalizeDonor({
        ...mapProfileFromDb(profile),
        donationHistory: currentHistory
      });
      upsertDonor(normalized);
      lastSyncError.value = '';
      return normalized;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao atualizar perfil do doador.';
      reportDonorError(lastSyncError.value, 'update-profile', 'Falha ao atualizar perfil');
      console.warn('Falha ao atualizar perfil:', error);
      return null;
    }
  };

  const refreshAllDonors = async (accessToken = null) => {
    if (!isSupabaseConfigured) return [];
    try {
      const rows = await listProfiles({ accessToken });
      const remoteDonors = Array.isArray(rows)
        ? rows.map((row) => {
            const donorId = String(row?.id || '');
            const currentHistory = donors.value.find((item) => String(item.id) === donorId)?.donationHistory || [];
            return normalizeDonor({
              ...mapProfileFromDb(row),
              donationHistory: currentHistory
            });
          })
        : [];
      const remoteIds = new Set(remoteDonors.map((item) => String(item.id)));
      const localOnly = donors.value.filter((item) => !remoteIds.has(String(item.id)) && String(item.id).startsWith('local-'));
      donors.value = [...remoteDonors, ...localOnly];
      lastSyncError.value = '';
      return donors.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar base de doadores.';
      reportDonorError(lastSyncError.value, 'refresh-all', 'Falha ao carregar doadores');
      console.warn('Falha ao carregar doadores:', error);
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
    refreshDonationHistory,
    updateDonorProfile,
    refreshDonorProfile,
    refreshAllDonors
  };
});
