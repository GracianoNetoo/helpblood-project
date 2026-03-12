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
          donors.value = parsed;
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar doadores:', error);
    }
  };

  const addDonor = (donor) => {
    donors.value.unshift({
      id: Date.now(),
      status: 'ativo',
      createdAt: new Date().toISOString(),
      ...donor
    });
  };

  const toggleStatus = (id) => {
    const target = donors.value.find((item) => item.id === id);
    if (!target) return;
    target.status = target.status === 'ativo' ? 'suspenso' : 'ativo';
  };

  const removeDonor = (id) => {
    donors.value = donors.value.filter((item) => item.id !== id);
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

  return { donors, addDonor, toggleStatus, removeDonor };
});
