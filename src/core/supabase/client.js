const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const isLegacyJwtKey = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

const parseJsonSafely = (text) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const normalizeAuthPayload = (payload) => {
  if (!payload) return null;

  const normalizedUser = payload.user || (payload.id ? payload : null);
  const normalizedSession = payload.session || (payload.access_token ? payload : null);

  return {
    ...payload,
    user: normalizedUser,
    session: normalizedSession
  };
};

const buildQueryString = (query = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === null || typeof value === 'undefined' || value === '') return;
    params.set(key, value);
  });
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

const buildHeaders = ({ accessToken, prefer } = {}) => {
  const headers = {
    apikey: supabaseAnonKey,
    'Content-Type': 'application/json'
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else if (isLegacyJwtKey.test(supabaseAnonKey)) {
    headers.Authorization = `Bearer ${supabaseAnonKey}`;
  }
  if (prefer) {
    headers.Prefer = prefer;
  }
  return headers;
};

async function request(path, { method = 'GET', query, body, accessToken, prefer } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase nao configurado.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}${buildQueryString(query)}`, {
    method,
    headers: buildHeaders({ accessToken, prefer }),
    body: typeof body === 'undefined' ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    const errorPayload = parseJsonSafely(errorText);
    const message = errorPayload?.msg || errorPayload?.message || errorPayload?.error_description || errorPayload?.error || errorText;
    throw new Error(message || `Falha na requisicao Supabase (${response.status}).`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const selectRows = (table, query = {}, options = {}) => {
  return request(table, { method: 'GET', query, ...options });
};

export const insertRows = (table, rows, options = {}) => {
  return request(table, {
    method: 'POST',
    body: Array.isArray(rows) ? rows : [rows],
    prefer: 'return=representation',
    ...options
  });
};

export const updateRows = (table, filters, patch, options = {}) => {
  return request(table, {
    method: 'PATCH',
    query: filters,
    body: patch,
    prefer: 'return=representation',
    ...options
  });
};

export const deleteRows = (table, filters, options = {}) => {
  return request(table, {
    method: 'DELETE',
    query: filters,
    prefer: 'return=representation',
    ...options
  });
};

export const invokeRpc = (fn, args = {}, options = {}) => {
  return request(`rpc/${fn}`, {
    method: 'POST',
    body: args,
    ...options
  });
};

async function authRequest(path, { method = 'GET', body, accessToken, query } = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase nao configurado.');
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/${path}${buildQueryString(query)}`, {
    method,
    headers: buildHeaders({ accessToken }),
    body: typeof body === 'undefined' ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    const errorPayload = parseJsonSafely(errorText);
    const message = errorPayload?.msg || errorPayload?.message || errorPayload?.error_description || errorPayload?.error || errorText;
    throw new Error(message || `Falha na autenticacao (${response.status}).`);
  }

  const text = await response.text();
  return normalizeAuthPayload(parseJsonSafely(text));
}

export const authSignUp = ({ email, password, data }) => {
  return authRequest('signup', {
    method: 'POST',
    body: { email, password, data }
  });
};

export const authSignInWithPassword = ({ email, password }) => {
  return authRequest('token?grant_type=password', {
    method: 'POST',
    body: { email, password }
  });
};

export const authRefreshSession = (refreshToken) => {
  return authRequest('token?grant_type=refresh_token', {
    method: 'POST',
    body: { refresh_token: refreshToken }
  });
};

export const authResetPasswordForEmail = ({ email, redirectTo }) => {
  const query = redirectTo ? buildQueryString({ redirect_to: redirectTo }) : '';
  return authRequest(`recover${query}`, {
    method: 'POST',
    body: {
      email,
      ...(redirectTo ? { redirect_to: redirectTo } : {})
    }
  });
};

export const authGetUser = (accessToken) => {
  return authRequest('user', {
    method: 'GET',
    accessToken
  });
};

export const authUpdateUser = (accessToken, attributes, options = {}) => {
  return authRequest('user', {
    method: 'PUT',
    accessToken,
    body: attributes,
    query: options.emailRedirectTo ? { redirect_to: options.emailRedirectTo } : undefined
  });
};

export const authSignOut = (accessToken) => {
  return authRequest('logout', {
    method: 'POST',
    accessToken
  });
};

export const authReauthenticate = (accessToken) => {
  return authRequest('reauthenticate', {
    method: 'POST',
    accessToken
  });
};
