import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  claimRewardAttempt,
  createRewardRow,
  getMyRewardStatus,
  isSupabaseConfigured,
  listAllRewardAttempts,
  listRewardAttemptsByDonorId,
  listRewardRows,
  updateRewardRow
} from '../api';
import { notifyError, notifyInfo, notifySuccess } from '@/core/services/toastService';

const normalizeReward = (item) => ({
  id: item?.id ? String(item.id) : `reward-${Date.now()}`,
  title: item?.title ?? 'Recompensa',
  description: item?.description ?? '',
  rewardType: item?.rewardType ?? item?.reward_type ?? 'agradecimento',
  rarity: item?.rarity ?? 'comum',
  quantityAvailable: Number(item?.quantityAvailable ?? item?.quantity_available ?? 0),
  weight: Number(item?.weight ?? 1),
  guaranteedAfterFailures: item?.guaranteedAfterFailures ?? item?.guaranteed_after_failures ?? null,
  expiresAt: item?.expiresAt ?? item?.expires_at ?? null,
  isActive: typeof item?.isActive === 'boolean' ? item.isActive : Boolean(item?.is_active ?? true),
  meta: item?.meta && typeof item.meta === 'object' ? item.meta : {},
  createdAt: item?.createdAt ?? item?.created_at ?? null,
  updatedAt: item?.updatedAt ?? item?.updated_at ?? null
});

const normalizeAttempt = (item) => ({
  id: item?.id ? String(item.id) : `attempt-${Date.now()}`,
  donorId: item?.donorId ?? item?.donor_id ?? null,
  rewardId: item?.rewardId ?? item?.reward_id ?? null,
  rewardCreditId: item?.rewardCreditId ?? item?.reward_credit_id ?? null,
  status: item?.status ?? 'falhou',
  rewardTitle: item?.rewardTitle ?? item?.reward_title_snapshot ?? null,
  rewardType: item?.rewardType ?? item?.reward_type_snapshot ?? null,
  rewardRarity: item?.rewardRarity ?? item?.reward_rarity_snapshot ?? null,
  attemptedAt: item?.attemptedAt ?? item?.attempted_at ?? item?.created_at ?? null,
  createdAt: item?.createdAt ?? item?.created_at ?? null
});

const defaultRewardStatus = () => ({
  availableAttempts: 0,
  totalDonations: 0,
  totalAttempts: 0,
  totalWins: 0,
  totalFailures: 0,
  failedStreak: 0,
  lastRewardTitle: null,
  lastAttemptAt: null
});

const reportRewardsError = (message, id, title = 'Falha ao sincronizar recompensas') => {
  notifyError(message, { id: `rewards-${id}`, title });
};

export const useRewardsStore = defineStore('rewards', () => {
  const rewardCatalog = ref([]);
  const myRewardAttempts = ref([]);
  const adminRewardAttempts = ref([]);
  const rewardStatus = ref(defaultRewardStatus());
  const isClaiming = ref(false);
  const isSavingReward = ref(false);
  const lastSyncError = ref('');

  const refreshRewardCatalog = async (accessToken = null) => {
    if (!isSupabaseConfigured) return [];
    try {
      const rows = await listRewardRows({}, { accessToken });
      rewardCatalog.value = Array.isArray(rows) ? rows.map(normalizeReward) : [];
      lastSyncError.value = '';
      return rewardCatalog.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar recompensas.';
      reportRewardsError(lastSyncError.value, 'catalog');
      console.warn('Falha ao carregar recompensas:', error);
      return rewardCatalog.value;
    }
  };

  const refreshMyRewardStatus = async (accessToken = null) => {
    if (!isSupabaseConfigured || !accessToken) return defaultRewardStatus();
    try {
      const response = await getMyRewardStatus({ accessToken });
      rewardStatus.value = {
        availableAttempts: Number(response?.available_attempts || 0),
        totalDonations: Number(response?.total_donations || 0),
        totalAttempts: Number(response?.total_attempts || 0),
        totalWins: Number(response?.total_wins || 0),
        totalFailures: Number(response?.total_failures || 0),
        failedStreak: Number(response?.failed_streak || 0),
        lastRewardTitle: response?.last_reward_title || null,
        lastAttemptAt: response?.last_attempt_at || null
      };
      lastSyncError.value = '';
      return rewardStatus.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar o estado das recompensas.';
      reportRewardsError(lastSyncError.value, 'status');
      console.warn('Falha ao carregar estado das recompensas:', error);
      return rewardStatus.value;
    }
  };

  const refreshMyRewardAttempts = async (donorId, accessToken = null) => {
    if (!isSupabaseConfigured || !donorId || !accessToken) return [];
    try {
      const rows = await listRewardAttemptsByDonorId(donorId, { accessToken });
      myRewardAttempts.value = Array.isArray(rows) ? rows.map(normalizeAttempt) : [];
      lastSyncError.value = '';
      return myRewardAttempts.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar o histórico de recompensas.';
      reportRewardsError(lastSyncError.value, 'history');
      console.warn('Falha ao carregar histórico de recompensas:', error);
      return myRewardAttempts.value;
    }
  };

  const refreshAllRewardAttempts = async (accessToken = null) => {
    if (!isSupabaseConfigured || !accessToken) return [];
    try {
      const rows = await listAllRewardAttempts({ accessToken });
      adminRewardAttempts.value = Array.isArray(rows) ? rows.map(normalizeAttempt) : [];
      lastSyncError.value = '';
      return adminRewardAttempts.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar as tentativas de recompensa.';
      reportRewardsError(lastSyncError.value, 'admin-history');
      console.warn('Falha ao carregar tentativas de recompensa:', error);
      return adminRewardAttempts.value;
    }
  };

  const claimMyReward = async (accessToken = null, donorId = null) => {
    if (!isSupabaseConfigured || !accessToken) return null;
    isClaiming.value = true;
    try {
      const result = await claimRewardAttempt({ accessToken });
      await Promise.all([
        refreshMyRewardStatus(accessToken),
        donorId ? refreshMyRewardAttempts(donorId, accessToken) : Promise.resolve(),
        refreshRewardCatalog(accessToken)
      ]);

      if (result?.status === 'ganhou' && result?.reward?.title) {
        notifySuccess(`Parabéns! Você ganhou: ${result.reward.title}.`, {
          id: 'reward-claim-success',
          title: 'Recompensa resgatada'
        });
      } else {
        notifyInfo('A tentativa foi consumida, mas desta vez não saiu prémio. Continue a doar para novas chances.', {
          id: 'reward-claim-failed',
          title: 'Tentativa registada'
        });
      }

      lastSyncError.value = '';
      return result;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao tentar resgatar uma recompensa.';
      reportRewardsError(lastSyncError.value, 'claim', 'Falha ao resgatar recompensa');
      console.warn('Falha ao resgatar recompensa:', error);
      return null;
    } finally {
      isClaiming.value = false;
    }
  };

  const saveReward = async (rewardDraft, accessToken = null) => {
    if (!isSupabaseConfigured || !accessToken) return null;
    isSavingReward.value = true;

    const payload = {
      title: rewardDraft.title,
      description: rewardDraft.description || null,
      reward_type: rewardDraft.rewardType,
      rarity: rewardDraft.rarity,
      quantity_available: Number(rewardDraft.quantityAvailable || 0),
      weight: Number(rewardDraft.weight || 1),
      guaranteed_after_failures: rewardDraft.guaranteedAfterFailures ? Number(rewardDraft.guaranteedAfterFailures) : null,
      expires_at: rewardDraft.expiresAt || null,
      is_active: Boolean(rewardDraft.isActive),
      meta: rewardDraft.meta && typeof rewardDraft.meta === 'object' ? rewardDraft.meta : {}
    };

    try {
      const rows = rewardDraft.id
        ? await updateRewardRow(rewardDraft.id, payload, { accessToken })
        : await createRewardRow(payload, { accessToken });
      const savedReward = Array.isArray(rows) && rows[0] ? normalizeReward(rows[0]) : null;
      await refreshRewardCatalog(accessToken);
      lastSyncError.value = '';
      notifySuccess('A recompensa foi guardada com sucesso.', {
        id: 'reward-save',
        title: 'Recompensa atualizada'
      });
      return savedReward;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao guardar a recompensa.';
      reportRewardsError(lastSyncError.value, 'save', 'Falha ao guardar recompensa');
      console.warn('Falha ao guardar recompensa:', error);
      return null;
    } finally {
      isSavingReward.value = false;
    }
  };

  return {
    rewardCatalog,
    myRewardAttempts,
    adminRewardAttempts,
    rewardStatus,
    isClaiming,
    isSavingReward,
    lastSyncError,
    refreshRewardCatalog,
    refreshMyRewardStatus,
    refreshMyRewardAttempts,
    refreshAllRewardAttempts,
    claimMyReward,
    saveReward
  };
});
