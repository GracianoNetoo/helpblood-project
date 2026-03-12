import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'univida_campaigns';

const seedCampaigns = [
  {
    id: 'camp-1',
    title: 'Mutirao Nacional: Universidade Agostinho Neto',
    location: 'Luanda',
    dateISO: new Date().toISOString().split('T')[0],
    time: '10:00',
    description: 'Unidade movel em frente a reitoria, com foco na reposicao urgente do banco de sangue central.',
    tags: ['O-', 'A+'],
    highlight: 'Critico',
    status: 'ativo'
  },
  {
    id: 'camp-2',
    title: 'Acao Comunitaria Praia Morena',
    location: 'Benguela',
    dateISO: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '08:00',
    description: 'Postos de triagem e coleta com apoio de voluntarios locais e parceiros comunitarios.',
    tags: ['Todos'],
    highlight: 'Aberto',
    status: 'ativo'
  }
];

export const useCampaignsStore = defineStore('campaigns', () => {
  const campaigns = ref([...seedCampaigns]);

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          campaigns.value = parsed;
        }
      }
    } catch (error) {
      console.warn('Falha ao carregar campanhas:', error);
    }
  };

  const addCampaign = (campaign) => {
    campaigns.value.unshift({
      id: `camp-${Date.now()}`,
      status: 'ativo',
      ...campaign
    });
  };

  const toggleStatus = (id) => {
    const target = campaigns.value.find((item) => item.id === id);
    if (!target) return;
    target.status = target.status === 'ativo' ? 'inativo' : 'ativo';
  };

  const removeCampaign = (id) => {
    campaigns.value = campaigns.value.filter((item) => item.id !== id);
  };

  loadFromStorage();

  watch(
    campaigns,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.warn('Falha ao salvar campanhas:', error);
      }
    },
    { deep: true }
  );

  return { campaigns, addCampaign, toggleStatus, removeCampaign };
});
