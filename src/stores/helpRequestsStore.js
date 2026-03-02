import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'univida_help_requests';

export const useHelpRequestsStore = defineStore('helpRequests', () => {
  const requests = ref([]);

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          requests.value = parsed;
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar pedidos salvos:', error);
    }
  };

  const addRequest = (request) => {
    requests.value.unshift({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...request
    });
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

  return { requests, addRequest, removeRequest };
});
