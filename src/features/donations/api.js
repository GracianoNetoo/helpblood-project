import { insertRows, invokeRpc, isSupabaseConfigured, selectRows, updateRows } from '@/core/supabase/client';

export { isSupabaseConfigured };

export const listDonationRows = (filters = {}, options = {}) => {
  return selectRows(
    'donations',
    {
      select: '*',
      ...filters
    },
    options
  );
};

export const createDonationRow = (donation, options = {}) => {
  return insertRows('donations', donation, options);
};

export const listDonationsByDonorId = (donorId, options = {}) => {
  return listDonationRows(
    {
      donor_id: `eq.${donorId}`,
      order: 'donated_at.desc,created_at.desc'
    },
    options
  );
};

export const listAllDonations = (options = {}) => {
  return listDonationRows(
    {
      order: 'donated_at.desc,created_at.desc'
    },
    options
  );
};

export const listRewardRows = (filters = {}, options = {}) => {
  return selectRows(
    'rewards',
    {
      select: '*',
      order: 'is_active.desc,created_at.desc',
      ...filters
    },
    options
  );
};

export const createRewardRow = (reward, options = {}) => {
  return insertRows('rewards', reward, options);
};

export const updateRewardRow = (rewardId, patch, options = {}) => {
  return updateRows(
    'rewards',
    {
      id: `eq.${rewardId}`
    },
    patch,
    options
  );
};

export const listRewardAttemptRows = (filters = {}, options = {}) => {
  return selectRows(
    'reward_attempts',
    {
      select: '*',
      order: 'attempted_at.desc,created_at.desc',
      ...filters
    },
    options
  );
};

export const listRewardAttemptsByDonorId = (donorId, options = {}) => {
  return listRewardAttemptRows(
    {
      donor_id: `eq.${donorId}`
    },
    options
  );
};

export const listAllRewardAttempts = (options = {}) => {
  return listRewardAttemptRows({}, options);
};

export const getMyRewardStatus = (options = {}) => {
  return invokeRpc('get_my_reward_status', {}, options);
};

export const claimRewardAttempt = (options = {}) => {
  return invokeRpc('claim_reward_attempt', {}, options);
};
