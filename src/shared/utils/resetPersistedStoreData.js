const STORE_RESET_KEY = 'univida_store_reset_20260328';
const STORE_KEYS_TO_CLEAR = [
  'univida_appointments',
  'univida_campaigns',
  'univida_deleted_campaigns',
  'univida_donors',
  'univida_help_requests',
  'univida_deleted_help_requests',
  'univida_supabase_session'
];

let hasResetRun = false;

export const resetPersistedStoreData = () => {
  if (hasResetRun || typeof window === 'undefined') return;
  hasResetRun = true;

  try {
    if (localStorage.getItem(STORE_RESET_KEY)) return;

    STORE_KEYS_TO_CLEAR.forEach((key) => {
      localStorage.removeItem(key);
    });

    localStorage.setItem(STORE_RESET_KEY, 'done');
  } catch (error) {
    console.warn('Falha ao limpar dados persistidos das stores:', error);
  }
};
