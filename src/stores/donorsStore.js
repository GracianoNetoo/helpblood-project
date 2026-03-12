import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'univida_donors';

const seedDonors = [
  {
    id: 1,
    nome: 'Manuel Francisco',
    tipo_sanguineo: 'O+',
    rh: 'Positivo (+)',
    provincia: 'Luanda',
    municipio: 'Talatona',
    telefone: '923000000',
    email: 'manuel@example.com',
    doacao_sangue: 'Sim, ja doei',
    lastDonationLiters: null,
    lastDonationDate: null,
    status: 'ativo',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    nome: 'Helena Sousa',
    tipo_sanguineo: 'A+',
    rh: 'Positivo (+)',
    provincia: 'Benguela',
    municipio: 'Lobito',
    telefone: '912000000',
    email: 'helena@example.com',
    doacao_sangue: 'Nao, sera a 1a vez',
    lastDonationLiters: null,
    lastDonationDate: null,
    status: 'ativo',
    createdAt: new Date().toISOString()
  }
];

export const useDonorsStore = defineStore('donors', () => {
  const donors = ref([...seedDonors]);

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          donors.value = parsed.map((item) => ({
            lastDonationLiters: null,
            lastDonationDate: null,
            ...item
          }));
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar doadores:', error);
    }
  };

  const addDonor = (donor) => {
    const record = {
      id: Date.now(),
      status: 'ativo',
      lastDonationLiters: null,
      lastDonationDate: null,
      createdAt: new Date().toISOString(),
      ...donor
    };
    donors.value.unshift(record);
    return record;
  };

  const toggleStatus = (id) => {
    const target = donors.value.find((item) => item.id === id);
    if (!target) return;
    target.status = target.status === 'ativo' ? 'suspenso' : 'ativo';
  };

  const removeDonor = (id) => {
    donors.value = donors.value.filter((item) => item.id !== id);
  };

  const updateLastDonationLiters = (id, liters) => {
    const target = donors.value.find((item) => item.id === id);
    if (!target) return;
    if (liters === '' || liters === null || typeof liters === 'undefined') {
      target.lastDonationLiters = null;
      target.lastDonationDate = null;
      return;
    }
    const normalized = typeof liters === 'string' ? liters.replace(',', '.') : liters;
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    target.lastDonationLiters = parsed;
    target.lastDonationDate = new Date().toISOString().split('T')[0];
  };

  loadFromStorage();

  watch(
    donors,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.warn('Falha ao salvar doadores:', error);
      }
    },
    { deep: true }
  );

  return { donors, addDonor, toggleStatus, removeDonor, updateLastDonationLiters };
});
