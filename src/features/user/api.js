import { isSupabaseConfigured, selectRows, updateRows } from '@/core/supabase/client';

export { isSupabaseConfigured };

export const getProfileById = (profileId, options = {}) => {
  return selectRows(
    'profiles',
    {
      select: '*',
      id: `eq.${profileId}`
    },
    options
  );
};

export const updateProfileById = (profileId, patch, options = {}) => {
  return updateRows('profiles', { id: `eq.${profileId}` }, patch, options);
};

export const listProfiles = (options = {}) => {
  return selectRows(
    'profiles',
    {
      select: '*',
      order: 'created_at.desc'
    },
    options
  );
};
