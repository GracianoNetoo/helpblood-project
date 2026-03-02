import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHelpRequestsStore = defineStore('helpRequests', () => {
  const requests = ref([]);

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

  return { requests, addRequest, removeRequest };
});
