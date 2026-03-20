import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'univida_help_requests';

const normalizeRequest = (request) => ({
  id: request?.id ?? Date.now(),
  createdAt: request?.createdAt ?? new Date().toISOString(),
  status: request?.status ?? 'pending',
  anonimo: Boolean(request?.anonimo),
  nome: request?.anonimo ? '' : request?.nome ?? '',
  tipo_sanguineo: request?.tipo_sanguineo ?? '',
  localizacao: request?.localizacao ?? '',
  volume: request?.volume ?? '',
  urgencia: request?.urgencia ?? '',
  motivo: request?.motivo ?? '',
  contacto: request?.contacto ?? ''
});

export const useHelpRequestsStore = defineStore('helpRequests', () => {
  const requests = ref([]);

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

  const addRequest = (request) => {
    requests.value.unshift(normalizeRequest(request));
  };

  const approveRequest = (id) => {
    const target = requests.value.find((item) => item.id === id);
    if (!target) return;
    target.status = 'approved';
  };

  const rejectRequest = (id) => {
    const target = requests.value.find((item) => item.id === id);
    if (!target) return;
    target.status = 'rejected';
  };

  const removeRequest = (id) => {
    requests.value = requests.value.filter((item) => item.id !== id);
  };

  loadFromStorage();

  watch(
    requests,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.warn('Falha ao salvar pedidos:', error);
      }
    },
    { deep: true }
  );

  return { requests, addRequest, removeRequest, approveRequest, rejectRequest };
});
