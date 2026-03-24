const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

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
    Authorization: `Bearer ${accessToken || supabaseAnonKey}`,
    'Content-Type': 'application/json'
  };
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
    throw new Error(errorText || `Falha na requisicao Supabase (${response.status}).`);
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
