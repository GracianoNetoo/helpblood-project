import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { isSupabaseConfigured, insertRows, selectRows, updateRows, deleteRows } from '../lib/supabaseClient';
import { useAuthStore } from './authStore';

const STORAGE_KEY = 'univida_help_requests';

const normalizeRequest = (request) => ({
  id: request?.id ?? `req-${Date.now()}`,
  createdAt: request?.createdAt ?? new Date().toISOString(),
  status: request?.status ?? 'pending',
  anonimo: Boolean(request?.anonimo),
  nome: request?.anonimo ? '' : request?.nome ?? '',
  tipo_sanguineo: request?.tipo_sanguineo ?? '',
  localizacao: request?.localizacao ?? '',
  volume: request?.volume ?? '',
  urgencia: request?.urgencia ?? '',
  motivo: request?.motivo ?? '',
  contacto: request?.contacto ?? '',
  source: request?.source ?? 'local'
});

const mapRequestFromDb = (row) => normalizeRequest({
  id: row?.id,
  createdAt: row?.created_at,
  status: row?.status,
  anonimo: row?.anonimo,
  nome: row?.requester_name,
  tipo_sanguineo: row?.tipo_sanguineo,
  localizacao: row?.localizacao,
  volume: row?.volume,
  urgencia: row?.urgencia,
  motivo: row?.motivo,
  contacto: row?.contacto,
  source: 'supabase'
});

const mapRequestToDb = (request, requesterId = null) => ({
  requester_id: requesterId,
  requester_name: request.anonimo ? '' : request.nome || '',
  anonimo: Boolean(request.anonimo),
  tipo_sanguineo: request.tipo_sanguineo,
  localizacao: request.localizacao,
  volume: request.volume || null,
  urgencia: request.urgencia,
  motivo: request.motivo,
  contacto: request.contacto
});

export const useHelpRequestsStore = defineStore('helpRequests', () => {
  const requests = ref([]);
  const lastSyncError = ref('');
  const syncSource = ref('local');

  const saveToStorage = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Falha ao salvar pedidos:', error);
    }
  };

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          requests.value = parsed.map(normalizeRequest);
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar pedidos salvos:', error);
    }
  };

  const replaceLocalRequest = (targetId, nextRequest) => {
    requests.value = requests.value.map((item) => (item.id === targetId ? normalizeRequest(nextRequest) : item));
  };

  const refreshApprovedFromSupabase = async () => {
    if (!isSupabaseConfigured) return false;
    try {
      const rows = await selectRows('help_requests', {
        select: '*',
        status: 'eq.approved',
        order: 'created_at.desc'
      });
      const approvedRemote = Array.isArray(rows) ? rows.map(mapRequestFromDb) : [];
      const localNonApproved = requests.value.filter((item) => item.status !== 'approved' || item.source !== 'supabase');
      const merged = new Map(localNonApproved.map((item) => [item.id, item]));
      approvedRemote.forEach((item) => {
        merged.set(item.id, item);
      });
      requests.value = Array.from(merged.values()).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      syncSource.value = 'supabase';
      lastSyncError.value = '';
      saveToStorage(requests.value);
      return true;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao sincronizar pedidos com o Supabase.';
      console.warn('Falha ao carregar pedidos do Supabase:', error);
      return false;
    }
  };

  const addRequest = async (request) => {
    const localRequest = normalizeRequest({
      id: `req-temp-${Date.now()}`,
      ...request
    });
    requests.value.unshift(localRequest);

    if (!isSupabaseConfigured) {
      return { ok: true, request: localRequest, source: 'local' };
    }

    const authStore = useAuthStore();
    const requesterId = authStore.isAuthenticated ? authStore.currentUser?.id || null : null;
    const accessToken = authStore.isAuthenticated ? authStore.accessToken : null;

    try {
      const rows = await insertRows(
        'help_requests',
        mapRequestToDb(localRequest, requesterId),
        accessToken ? { accessToken } : {}
      );
      const created = Array.isArray(rows) ? rows[0] : null;
      if (created) {
        replaceLocalRequest(localRequest.id, mapRequestFromDb(created));
      }
      syncSource.value = 'supabase';
      lastSyncError.value = '';
      return { ok: true, request: created ? mapRequestFromDb(created) : localRequest, source: 'supabase' };
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao enviar pedido ao Supabase.';
      console.warn('Falha ao criar pedido no Supabase:', error);
      return { ok: false, error, request: localRequest, source: 'local' };
    }
  };

  const approveRequest = (id) => {
    const target = requests.value.find((item) => item.id === id);
    if (!target) return;
    const previousStatus = target.status;
    target.status = 'approved';

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      updateRows('help_requests', { id: `eq.${id}` }, { status: 'approved' })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          target.status = previousStatus;
          lastSyncError.value = error.message || 'Falha ao aprovar pedido no Supabase.';
          console.warn('Falha ao aprovar pedido no Supabase:', error);
        });
    }
  };

  const rejectRequest = (id) => {
    const target = requests.value.find((item) => item.id === id);
    if (!target) return;
    const previousStatus = target.status;
    target.status = 'rejected';

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      updateRows('help_requests', { id: `eq.${id}` }, { status: 'rejected' })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          target.status = previousStatus;
          lastSyncError.value = error.message || 'Falha ao rejeitar pedido no Supabase.';
          console.warn('Falha ao rejeitar pedido no Supabase:', error);
        });
    }
  };

  const removeRequest = (id) => {
    const snapshot = [...requests.value];
    requests.value = requests.value.filter((item) => item.id !== id);

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      deleteRows('help_requests', { id: `eq.${id}` })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          requests.value = snapshot;
          lastSyncError.value = error.message || 'Falha ao remover pedido no Supabase.';
          console.warn('Falha ao remover pedido no Supabase:', error);
        });
    }
  };

  loadFromStorage();
  refreshApprovedFromSupabase();

  watch(
    requests,
    (value) => {
      saveToStorage(value);
    },
    { deep: true }
  );

  return {
    requests,
    lastSyncError,
    syncSource,
    addRequest,
    removeRequest,
    approveRequest,
    rejectRequest,
    refreshApprovedFromSupabase
  };
});
