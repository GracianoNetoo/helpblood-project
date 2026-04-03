import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import {
  deleteAuthenticatedAccount,
  getAuthenticatedUser,
  isSupabaseConfigured,
  refreshAuthSession,
  requestPasswordChangeVerification,
  requestPasswordRecoveryEmail,
  signInWithEmail,
  signOutAuthenticatedUser,
  signUpWithEmail,
  updateAuthenticatedUser
} from '../api';
import { useDonorsStore } from '../../user/store/donorsStore';
import { ensurePersistedStoreSchemaVersion } from '../../../shared/utils/ensurePersistedStoreSchemaVersion';

const SESSION_STORAGE_KEY = 'univida_supabase_session';

export const useAuthStore = defineStore('auth', () => {
  ensurePersistedStoreSchemaVersion();
  const session = ref(null);
  const currentUser = ref(null);
  const currentUserRole = ref('donor');
  const currentDonorId = ref(null);
  const authError = ref('');
  const isLoading = ref(false);
  const isInitialized = ref(false);
  let initializePromise = null;

  const accessToken = computed(() => session.value?.access_token || null);
  const isAuthenticated = computed(() => Boolean(currentUser.value?.id && accessToken.value));
  const isAdmin = computed(() => currentUserRole.value === 'admin');

  const syncDerivedState = () => {
    currentDonorId.value = currentUser.value?.id || null;
  };

  const normalizeSession = (candidateSession) => {
    if (!candidateSession) return null;

    const expiresIn = Number(candidateSession.expires_in || 0) || null;
    const expiresAt = Number(candidateSession.expires_at || 0) || null;

    return {
      ...candidateSession,
      expires_in: expiresIn,
      expires_at: expiresAt || (expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : null)
    };
  };

  const sessionNeedsRefresh = (candidateSession) => {
    if (!candidateSession?.refresh_token) return false;
    if (!candidateSession?.access_token) return true;
    if (!candidateSession?.expires_at) return false;
    return Number(candidateSession.expires_at) <= Math.floor(Date.now() / 1000) + 60;
  };

  const persistSession = () => {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session.value));
    } catch (error) {
      console.warn('Falha ao salvar sessão auth:', error);
    }
  };

  const loadStoredSession = () => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Falha ao carregar sessão auth:', error);
      return null;
    }
  };

  const clearSession = () => {
    session.value = null;
    currentUser.value = null;
    currentUserRole.value = 'donor';
    currentDonorId.value = null;
    authError.value = '';
  };

  const translateAuthError = (error, fallbackMessage) => {
    const message = String(error?.message || '').toLowerCase();

    if (message.includes('email not confirmed') || message.includes('email_not_confirmed')) {
      return 'Confirme o seu email antes de iniciar sessao.';
    }

    if (message.includes('user already registered')) {
      return 'Este email já esta registado. Tente iniciar sessão.';
    }

    if (message.includes('invalid login credentials')) {
      return 'Email ou palavra-passe incorretos.';
    }

    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.';
    }

    if (message.includes('security purposes') || message.includes('60 seconds')) {
      return 'Aguarde alguns segundos antes de pedir um novo link.';
    }

    if (message.includes('redirect') && message.includes('not allowed')) {
      return 'O link de retorno da recuperação não esta autorizado no Supabase.';
    }

    if (message.includes('failed to fetch') || message.includes('networkerror')) {
      return 'Não foi possivel comunicar com o servidor de autenticação.';
    }

    return fallbackMessage;
  };

  const setRecoverySessionFromUrl = async (hash) => {
    const normalizedHash = String(hash || '').replace(/^#/, '');
    if (!normalizedHash) {
      return { ok: false, reason: 'missing_hash' };
    }

    const params = new URLSearchParams(normalizedHash);
    const accessTokenFromUrl = params.get('access_token');
    const refreshTokenFromUrl = params.get('refresh_token');
    const recoveryType = params.get('type');

    if (!accessTokenFromUrl || recoveryType !== 'recovery') {
      return { ok: false, reason: 'not_recovery' };
    }

    isLoading.value = true;
    authError.value = '';

    try {
      const user = await getAuthenticatedUser(accessTokenFromUrl);
      const recoverySession = {
        access_token: accessTokenFromUrl,
        refresh_token: refreshTokenFromUrl,
        token_type: params.get('token_type') || 'bearer',
        expires_in: Number(params.get('expires_in') || 0) || null,
        expires_at: Number(params.get('expires_at') || 0) || null
      };

      await setSessionState({
        nextSession: recoverySession,
        nextUser: user
      });

      return { ok: true, user };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel validar o link de recuperação.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const refreshCurrentProfile = async () => {
    if (!currentDonorId.value) {
      currentUserRole.value = currentUser.value?.app_metadata?.role || currentUser.value?.user_metadata?.role || 'donor';
      return;
    }
    const donorsStore = useDonorsStore();
    const profile = await donorsStore.refreshDonorProfile(currentDonorId.value, accessToken.value);
    const confirmedEmail = String(currentUser.value?.email || '').trim().toLowerCase();

    currentUserRole.value = profile?.role || currentUser.value?.app_metadata?.role || currentUser.value?.user_metadata?.role || 'donor';
    await donorsStore.refreshDonationHistory(currentDonorId.value, accessToken.value);

    if (profile && confirmedEmail && String(profile.email || '').trim().toLowerCase() !== confirmedEmail) {
      await donorsStore.updateDonorProfile(
        currentDonorId.value,
        { email: confirmedEmail },
        accessToken.value
      );
    }
  };

  const setSessionState = async ({ nextSession, nextUser }) => {
    session.value = normalizeSession(nextSession);
    currentUser.value = nextUser;
    syncDerivedState();
    persistSession();
    await refreshCurrentProfile();
  };

  const refreshSession = async (refreshToken) => {
    if (!refreshToken) {
      throw new Error('Refresh token ausente.');
    }

    const response = await refreshAuthSession(refreshToken);
    const nextSession = response?.session || response;
    const nextUser = response?.user || null;

    if (!nextSession?.access_token || !nextUser?.id) {
      throw new Error('Nao foi possivel renovar a sessao.');
    }

    await setSessionState({
      nextSession,
      nextUser
    });

    return nextSession;
  };

  const initialize = async () => {
    if (isInitialized.value) return;
    if (initializePromise) return initializePromise;

    initializePromise = (async () => {
      if (!isSupabaseConfigured) {
        clearSession();
        return;
      }

      const storedSession = loadStoredSession();
      if (!storedSession?.access_token && !storedSession?.refresh_token) {
        clearSession();
        return;
      }

      isLoading.value = true;
      try {
        if (sessionNeedsRefresh(storedSession)) {
          await refreshSession(storedSession.refresh_token);
        } else {
          try {
            const user = await getAuthenticatedUser(storedSession.access_token);
            await setSessionState({
              nextSession: storedSession,
              nextUser: user
            });
          } catch (error) {
            if (storedSession.refresh_token) {
              await refreshSession(storedSession.refresh_token);
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        clearSession();
        authError.value = 'A sua sessão expirou. Faça login novamente.';
      } finally {
        isLoading.value = false;
      }
    })();

    try {
      await initializePromise;
      isInitialized.value = true;
    } finally {
      initializePromise = null;
    }
  };

  const signIn = async ({ email, password }) => {
    authError.value = '';
    isLoading.value = true;
    try {
      const response = await signInWithEmail({ email, password });
      const nextSession = response?.session || response;
      const nextUser = response?.user || null;

      if (!nextSession?.access_token || !nextUser?.id) {
        throw new Error('Sessão invalida recebida.');
      }

      await setSessionState({
        nextSession,
        nextUser
      });
      return { ok: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel iniciar sessão com essas credenciais.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const signUpDonor = async ({ email, password, donorProfile }) => {
    authError.value = '';
    isLoading.value = true;
    try {
      const response = await signUpWithEmail({
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
        throw new Error('Cadastro sem utilizador valido retornado.');
      }

      session.value = null;
      currentUser.value = nextUser;
      currentUserRole.value = nextUser?.app_metadata?.role || nextUser?.user_metadata?.role || 'donor';
      syncDerivedState();
      authError.value = '';
      persistSession();
      return { ok: true, needsEmailConfirmation: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel criar a conta agora.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const requestPasswordRecovery = async ({ email, redirectTo }) => {
    authError.value = '';
    isLoading.value = true;

    try {
      await requestPasswordRecoveryEmail({ email, redirectTo });
      return { ok: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel enviar o link de recuperação.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const requestPasswordChangeNonce = async () => {
    authError.value = '';
    isLoading.value = true;

    try {
      if (!accessToken.value) {
        throw new Error('Sessão invalida para confirmar a palavra-passe.');
      }

      await requestPasswordChangeVerification(accessToken.value);
      return { ok: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel enviar o codigo de confirmação.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const updatePassword = async ({ password, nonce = null }) => {
    authError.value = '';
    isLoading.value = true;

    try {
      if (!accessToken.value) {
        throw new Error('Sessao de recuperacao invalida.');
      }

      const response = await updateAuthenticatedUser(accessToken.value, {
        password,
        ...(nonce ? { nonce } : {})
      });
      currentUser.value = response?.user || response || currentUser.value;
      syncDerivedState();
      persistSession();
      await refreshCurrentProfile();
      return { ok: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel atualizar a palavra-passe.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const updateAccountProfile = async ({ email, telefone, provincia, municipio, emailRedirectTo = null }) => {
    authError.value = '';
    isLoading.value = true;

    try {
      if (!currentUser.value?.id || !accessToken.value) {
        throw new Error('Sessao invalida para atualizar a conta.');
      }

      const normalizedEmail = String(email || '').trim().toLowerCase();
      const previousEmail = String(currentUser.value?.email || '').trim().toLowerCase();
      const emailChanged = Boolean(normalizedEmail && normalizedEmail !== previousEmail);

      if (emailChanged) {
        const response = await updateAuthenticatedUser(
          accessToken.value,
          { email: normalizedEmail },
          emailRedirectTo ? { emailRedirectTo } : {}
        );
        currentUser.value = response?.user || response || currentUser.value;
        syncDerivedState();
        persistSession();
      }

      const donorsStore = useDonorsStore();
      await donorsStore.updateDonorProfile(
        currentUser.value.id,
        {
          telefone: telefone || null,
          provincia: provincia || null,
          municipio: municipio || null
        },
        accessToken.value
      );

      await refreshCurrentProfile();
      return { ok: true, emailChanged };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel atualizar os dados da conta.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAccount = async () => {
    authError.value = '';
    isLoading.value = true;

    try {
      if (!accessToken.value || !currentUser.value?.id) {
        throw new Error('Sessao invalida para eliminar a conta.');
      }

      const donorsStore = useDonorsStore();
      await deleteAuthenticatedAccount(accessToken.value);
      donorsStore.removeDonor(currentUser.value.id);
      clearSession();
      persistSession();
      return { ok: true };
    } catch (error) {
      authError.value = translateAuthError(error, 'Não foi possivel eliminar a conta agora.');
      return { ok: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    try {
      if (accessToken.value && isSupabaseConfigured) {
        await signOutAuthenticatedUser(accessToken.value);
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
    currentUserRole,
    currentDonorId,
    accessToken,
    authError,
    isLoading,
    isInitialized,
    isAuthenticated,
    isAdmin,
    initialize,
    signIn,
    signUpDonor,
    requestPasswordRecovery,
    requestPasswordChangeNonce,
    refreshSession,
    setRecoverySessionFromUrl,
    updateAccountProfile,
    updatePassword,
    deleteAccount,
    signOut,
    clearSession
  };
});
