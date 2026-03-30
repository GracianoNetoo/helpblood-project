import { deleteRows, insertRows, isSupabaseConfigured, selectRows, updateRows } from '../../core/supabase/client';

export { isSupabaseConfigured };

export const listCampaignRows = (options = {}) => {
  return selectRows(
    'campaigns',
    {
      select: '*',
      order: 'date_iso.asc'
    },
    options
  );
};

export const createCampaignRow = (campaign, options = {}) => {
  return insertRows('campaigns', campaign, options);
};

export const updateCampaignRow = (campaignId, patch, options = {}) => {
  return updateRows('campaigns', { id: `eq.${campaignId}` }, patch, options);
};

export const deleteCampaignRow = (campaignId, options = {}) => {
  return deleteRows('campaigns', { id: `eq.${campaignId}` }, options);
};

export const listApprovedHelpRequestRows = (options = {}) => {
  return selectRows(
    'help_requests',
    {
      select: '*',
      status: 'eq.approved',
      order: 'created_at.desc'
    },
    options
  );
};

export const createHelpRequestRow = (request, options = {}) => {
  return insertRows('help_requests', request, options);
};

export const updateHelpRequestRow = (requestId, patch, options = {}) => {
  return updateRows('help_requests', { id: `eq.${requestId}` }, patch, options);
};

export const deleteHelpRequestRow = (requestId, options = {}) => {
  return deleteRows('help_requests', { id: `eq.${requestId}` }, options);
};
