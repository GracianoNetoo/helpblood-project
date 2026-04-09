import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import {
  createHelpRequestRow,
  deleteHelpRequestRow,
  isSupabaseConfigured,
  listApprovedHelpRequestRows,
  listHelpRequestRows,
  updateHelpRequestRow
} from '../api';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ensurePersistedStoreSchemaVersion } from '@/shared/utils/ensurePersistedStoreSchemaVersion';
import { notifyError } from '@/core/services/toastService';

const STORAGE_KEY = 'univida_help_requests';
const DELETED_STORAGE_KEY = 'univida_deleted_help_requests';

const normalizeRequest = (request) => ({
  id: request?.id ?? `req-${Date.now()}`,
  createdAt: request?.createdAt ?? new Date().toISOString(),
  updatedAt: request?.updatedAt ?? request?.createdAt ?? new Date().toISOString(),
  status: request?.status ?? 'pending',
  requesterId: request?.requesterId ? String(request.requesterId) : null,
  approvedBy: request?.approvedBy ? String(request.approvedBy) : null,
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
  updatedAt: row?.updated_at,
  status: row?.status,
  requesterId: row?.requester_id,
  approvedBy: row?.approved_by,
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

const reportHelpRequestError = (message, id, title = 'Falha ao sincronizar pedidos') => {
  notifyError(message, { id: `help-requests-${id}`, title });
};

export const useHelpRequestsStore = defineStore('helpRequests', () => {
  ensurePersistedStoreSchemaVersion();
  const requests = ref([]);
  const lastSyncError = ref('');
  const syncSource = ref('local');
  const deletedRequestIds = ref([]);

  const saveToStorage = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Falha ao salvar pedidos:', error);
    }
  };

  const saveDeletedIds = (value) => {
    try {
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      console.warn('Falha ao salvar pedidos removidos:', error);
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

  const loadDeletedIds = () => {
    try {
      const raw = localStorage.getItem(DELETED_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        deletedRequestIds.value = parsed.map((item) => String(item));
      }
    } catch (error) {
      console.warn('Falha ao carregar pedidos removidos:', error);
    }
  };

  const rememberDeletedRequest = (id) => {
    const normalizedId = String(id);
    if (deletedRequestIds.value.includes(normalizedId)) return;
    deletedRequestIds.value = [...deletedRequestIds.value, normalizedId];
    saveDeletedIds(deletedRequestIds.value);
  };

  const replaceLocalRequest = (targetId, nextRequest) => {
    requests.value = requests.value.map((item) => (item.id === targetId ? normalizeRequest(nextRequest) : item));
  };

  const refreshApprovedFromSupabase = async () => {
    if (!isSupabaseConfigured) return false;
    try {
      const rows = await listApprovedHelpRequestRows();
      const approvedRemote = Array.isArray(rows)
        ? rows
            .map(mapRequestFromDb)
            .filter((item) => !deletedRequestIds.value.includes(String(item.id)))
        : [];
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
      reportHelpRequestError(lastSyncError.value, 'refresh');
      console.warn('Falha ao carregar pedidos do Supabase:', error);
      return false;
    }
  };

  const refreshAllRequests = async (accessToken = null) => {
    if (!isSupabaseConfigured || !accessToken) return requests.value;
    try {
      const rows = await listHelpRequestRows({}, { accessToken });
      const remoteRequests = Array.isArray(rows)
        ? rows
            .map(mapRequestFromDb)
            .filter((item) => !deletedRequestIds.value.includes(String(item.id)))
        : [];
      const remoteIds = new Set(remoteRequests.map((item) => String(item.id)));
      const localOnly = requests.value.filter((item) => String(item.id).startsWith('req-temp-') && !remoteIds.has(String(item.id)));
      requests.value = [...remoteRequests, ...localOnly].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      syncSource.value = 'supabase';
      lastSyncError.value = '';
      saveToStorage(requests.value);
      return requests.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar a base de pedidos.';
      reportHelpRequestError(lastSyncError.value, 'refresh-all', 'Falha ao carregar pedidos');
      console.warn('Falha ao carregar base completa de pedidos:', error);
      return requests.value;
    }
  };

  const refreshRequestsForRequester = async (requesterId, accessToken = null) => {
    if (!isSupabaseConfigured || !requesterId || !accessToken) return requests.value;

    try {
      const rows = await listHelpRequestRows(
        { requester_id: `eq.${requesterId}` },
        { accessToken }
      );

      const requesterRemote = Array.isArray(rows) ? rows.map(mapRequestFromDb) : [];
      const requesterIds = new Set(requesterRemote.map((item) => String(item.id)));
      const normalizedRequesterId = String(requesterId);

      const requesterLocalOnly = requests.value.filter((item) => {
        return String(item.requesterId || '') === normalizedRequesterId
          && String(item.id).startsWith('req-temp-')
          && !requesterIds.has(String(item.id));
      });

      const otherRequests = requests.value.filter((item) => {
        return String(item.requesterId || '') !== normalizedRequesterId;
      });

      requests.value = [...requesterRemote, ...requesterLocalOnly, ...otherRequests].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      lastSyncError.value = '';
      saveToStorage(requests.value);
      return requests.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar os seus pedidos de ajuda.';
      reportHelpRequestError(lastSyncError.value, 'owner-refresh', 'Falha ao carregar os seus pedidos');
      console.warn('Falha ao carregar pedidos do utilizador no Supabase:', error);
      return requests.value;
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
      const rows = await createHelpRequestRow(mapRequestToDb(localRequest, requesterId), accessToken ? { accessToken } : {});
      const created = Array.isArray(rows) ? rows[0] : null;
      if (created) {
        replaceLocalRequest(localRequest.id, mapRequestFromDb(created));
      }
      syncSource.value = 'supabase';
      lastSyncError.value = '';
      return { ok: true, request: created ? mapRequestFromDb(created) : localRequest, source: 'supabase' };
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao enviar pedido ao Supabase.';
      reportHelpRequestError(lastSyncError.value, 'create', 'Falha ao enviar pedido de ajuda');
      console.warn('Falha ao criar pedido no Supabase:', error);
      return { ok: false, error, request: localRequest, source: 'local' };
    }
  };

  const approveRequest = (id) => {
    const target = requests.value.find((item) => item.id === id);
    if (!target) return;
    const previousStatus = target.status;
    const previousUpdatedAt = target.updatedAt;
    target.status = 'approved';
    target.updatedAt = new Date().toISOString();

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      updateHelpRequestRow(id, { status: 'approved' })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          target.status = previousStatus;
          target.updatedAt = previousUpdatedAt;
          lastSyncError.value = error.message || 'Falha ao aprovar pedido no Supabase.';
          reportHelpRequestError(lastSyncError.value, 'approve', 'Falha ao aprovar pedido');
          console.warn('Falha ao aprovar pedido no Supabase:', error);
        });
    }
  };

  const rejectRequest = (id) => {
    const target = requests.value.find((item) => item.id === id);
    if (!target) return;
    const previousStatus = target.status;
    const previousUpdatedAt = target.updatedAt;
    target.status = 'rejected';
    target.updatedAt = new Date().toISOString();

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      updateHelpRequestRow(id, { status: 'rejected' })
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          target.status = previousStatus;
          target.updatedAt = previousUpdatedAt;
          lastSyncError.value = error.message || 'Falha ao rejeitar pedido no Supabase.';
          reportHelpRequestError(lastSyncError.value, 'reject', 'Falha ao rejeitar pedido');
          console.warn('Falha ao rejeitar pedido no Supabase:', error);
        });
    }
  };

  const removeRequest = (id) => {
    const normalizedId = String(id);
    requests.value = requests.value.filter((item) => item.id !== id);
    if (!String(id).includes('-temp-')) {
      rememberDeletedRequest(normalizedId);
    }

    if (isSupabaseConfigured && !String(id).includes('-temp-')) {
      deleteHelpRequestRow(id)
        .then(() => {
          syncSource.value = 'supabase';
          lastSyncError.value = '';
        })
        .catch((error) => {
          syncSource.value = 'local';
          lastSyncError.value = error.message || 'Pedido removido localmente, mas a exclusao no Supabase falhou.';
          reportHelpRequestError(lastSyncError.value, 'remove', 'Falha ao remover pedido');
          console.warn('Falha ao remover pedido no Supabase:', error);
        });
    }
  };

  loadFromStorage();
  loadDeletedIds();
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
    deletedRequestIds,
    addRequest,
    removeRequest,
    approveRequest,
    rejectRequest,
    refreshApprovedFromSupabase,
    refreshAllRequests,
    refreshRequestsForRequester
  };
});
