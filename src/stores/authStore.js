import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { authGetUser, authSignInWithPassword, authSignOut, authSignUp, isSupabaseConfigured } from '../lib/supabaseClient';
import { useDonorsStore } from './donorsStore';

const SESSION_STORAGE_KEY = 'univida_supabase_session';

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null);
  const currentUser = ref(null);
  const currentDonorId = ref(null);
  const authError = ref('');
  const isLoading = ref(false);
  const isInitialized = ref(false);

  const accessToken = computed(() => session.value?.access_token || null);
  const isAuthenticated = computed(() => Boolean(currentUser.value?.id && accessToken.value));

  const syncDerivedState = () => {
    currentDonorId.value = currentUser.value?.id || null;
  };

  const persistSession = () => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session.value));
    } catch (error) {
      console.warn('Falha ao salvar sessao auth:', error);
    }
  };

  const loadStoredSession = () => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Falha ao carregar sessao auth:', error);
      return null;
    }
  };

  const clearSession = () => {
    session.value = null;
    currentUser.value = null;
    currentDonorId.value = null;
    authError.value = '';
  };

  const translateAuthError = (error, fallbackMessage) => {
    const message = String(error?.message || '').toLowerCase();

    if (message.includes('email not confirmed') || message.includes('email_not_confirmed')) {
      return 'Confirme o seu email antes de iniciar sessao.';
    }

    if (message.includes('user already registered')) {
      return 'Este email ja esta registado. Tente iniciar sessao.';
    }

    if (message.includes('invalid login credentials')) {
      return 'Email ou palavra-passe incorretos.';
    }

    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.';
    }

    if (message.includes('failed to fetch') || message.includes('networkerror')) {
      return 'Nao foi possivel comunicar com o servidor de autenticacao.';
    }

    return fallbackMessage;
  };

  const refreshCurrentProfile = async () => {
    if (!currentDonorId.value) return;
    const donorsStore = useDonorsStore();
    await donorsStore.refreshDonorProfile(currentDonorId.value, accessToken.value);
  };

  const setSessionState = async ({ nextSession, nextUser }) => {
    session.value = nextSession;
    currentUser.value = nextUser;
    syncDerivedState();
    persistSession();
    await refreshCurrentProfile();
  };

  const initialize = async () => {
    if (isInitialized.value) return;
    isInitialized.value = true;

    if (!isSupabaseConfigured) {
      return;
    }

    const storedSession = loadStoredSession();
    if (!storedSession?.access_token) {
      clearSession();
      return;
    }

    isLoading.value = true;
    try {
      const user = await authGetUser(storedSession.access_token);
      await setSessionState({
        nextSession: storedSession,
        nextUser: user
      });
    } catch (error) {
      clearSession();
      authError.value = 'A sua sessao expirou. Faca login novamente.';
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async ({ email, password }) => {
    authError.value = '';
    isLoading.value = true;
    try {
      const response = await authSignInWithPassword({ email, password });
      const nextSession = response?.session || response;
      const nextUser = response?.user || null;

      if (!nextSession?.access_token || !nextUser?.id) {
        throw new Error('Sessao invalida recebida do Supabase.');
      }

      await setSessionState({
        nextSession,
        nextUser
      });
      return { ok: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Nao foi possivel iniciar sessao com essas credenciais.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const signUpDonor = async ({ email, password, donorProfile }) => {
    authError.value = '';
    isLoading.value = true;
    try {
      const response = await authSignUp({
        email,
        password,
        data: donorProfile
      });

      const nextUser = response?.user || null;
      const nextSession = response?.session || null;

      if (nextSession && nextUser) {
        await setSessionState({
          nextSession,
          nextUser
        });
        return { ok: true, needsEmailConfirmation: false };
      }

      if (!nextUser?.id) {
        throw new Error('Cadastro sem utilizador valido retornado pelo Supabase.');
      }

      currentUser.value = nextUser;
      syncDerivedState();
      authError.value = '';
      persistSession();
      return { ok: true, needsEmailConfirmation: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Nao foi possivel criar a conta agora.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    try {
      if (accessToken.value && isSupabaseConfigured) {
        await authSignOut(accessToken.value);
      }
    } catch (error) {
      console.warn('Falha ao terminar sessao no Supabase:', error);
    } finally {
      clearSession();
      persistSession();
    }
  };

  watch(
    session,
    () => {
      persistSession();
    },
    { deep: true }
  );

  return {
    session,
    currentUser,
    currentDonorId,
    accessToken,
    authError,
    isLoading,
    isInitialized,
    isAuthenticated,
    initialize,
    signIn,
    signUpDonor,
    signOut,
    clearSession
  };
});
