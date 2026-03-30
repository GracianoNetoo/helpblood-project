import {
  authGetUser,
  authReauthenticate,
  authRefreshSession,
  authResetPasswordForEmail,
  authSignInWithPassword,
  authSignOut,
  authSignUp,
  authUpdateUser,
  invokeRpc,
  isSupabaseConfigured
} from '../../core/supabase/client';

export { isSupabaseConfigured };

export const signUpWithEmail = ({ email, password, data }) => {
  return authSignUp({ email, password, data });
};

export const signInWithEmail = ({ email, password }) => {
  return authSignInWithPassword({ email, password });
};

export const refreshAuthSession = (refreshToken) => {
  return authRefreshSession(refreshToken);
};

export const requestPasswordRecoveryEmail = ({ email, redirectTo }) => {
  return authResetPasswordForEmail({ email, redirectTo });
};

export const getAuthenticatedUser = (accessToken) => {
  return authGetUser(accessToken);
};

export const updateAuthenticatedUser = (accessToken, attributes, options = {}) => {
  return authUpdateUser(accessToken, attributes, options);
};

export const signOutAuthenticatedUser = (accessToken) => {
  return authSignOut(accessToken);
};

export const requestPasswordChangeVerification = (accessToken) => {
  return authReauthenticate(accessToken);
};

export const deleteAuthenticatedAccount = (accessToken) => {
  return invokeRpc('delete_my_account', {}, { accessToken });
};
