import { insertRows, isSupabaseConfigured, selectRows } from '../../core/supabase/client';

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
