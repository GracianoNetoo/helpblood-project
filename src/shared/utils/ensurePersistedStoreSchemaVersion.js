const STORE_SCHEMA_VERSION_KEY = 'univida_store_schema_version';
const CURRENT_STORE_SCHEMA_VERSION = '20260401';

let hasSchemaCheckRun = false;

export const ensurePersistedStoreSchemaVersion = () => {
  if (hasSchemaCheckRun || typeof window === 'undefined') return;
  hasSchemaCheckRun = true;

  try {
    const storedVersion = localStorage.getItem(STORE_SCHEMA_VERSION_KEY);
    if (storedVersion === CURRENT_STORE_SCHEMA_VERSION) return;

    localStorage.setItem(STORE_SCHEMA_VERSION_KEY, CURRENT_STORE_SCHEMA_VERSION);
  } catch (error) {
    console.warn('Falha ao registrar a versão do schema local das stores:', error);
  }
};
