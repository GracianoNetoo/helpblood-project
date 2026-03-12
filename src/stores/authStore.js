import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'univida_current_donor';

export const useAuthStore = defineStore('auth', () => {
  const currentDonorId = ref(null);

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed !== null && typeof parsed !== 'undefined') {
        currentDonorId.value = parsed;
      }
    } catch (error) {
      console.warn('Falha ao carregar sessao:', error);
    }
  };

  const setCurrentDonorId = (id) => {
    currentDonorId.value = id;
  };

  const clearSession = () => {
    currentDonorId.value = null;
  };

  loadFromStorage();

  watch(
    currentDonorId,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.warn('Falha ao salvar sessao:', error);
      }
    }
  );

  return { currentDonorId, setCurrentDonorId, clearSession };
});
