<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { History, Droplet } from 'lucide-vue-next';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useDonorsStore } from '@/features/user/store/donorsStore';
import { useCampaignsStore } from '@/features/events/store/campaignsStore';

const authStore = useAuthStore();
const donorsStore = useDonorsStore();
const campaignsStore = useCampaignsStore();

const { currentDonorId, accessToken } = storeToRefs(authStore);
const { donors } = storeToRefs(donorsStore);
const { campaigns } = storeToRefs(campaignsStore);

const currentDonorIdValue = computed(() => (currentDonorId.value ? String(currentDonorId.value) : null));
const fallbackDonor = computed(() => donors.value[0] || null);
const currentDonor = computed(() => {
  if (currentDonorIdValue.value) {
    return donors.value.find((donor) => String(donor.id) === currentDonorIdValue.value) || fallbackDonor.value;
  }
  return fallbackDonor.value;
});

const donationHistory = computed(() => {
  const history = currentDonor.value?.donationHistory;
  if (!Array.isArray(history)) return [];
  return history;
});

const donationCount = computed(() => donationHistory.value.length);
const totalDonationLiters = computed(() => {
  const value = currentDonor.value?.totalDonationLiters;
  if (value === null || typeof value === 'undefined') return 0;
  return value;
});

const latestDonationDate = computed(() => {
  const first = donationHistory.value[0];
  if (first?.date) return first.date;
  return currentDonor.value?.lastDonationDate || null;
});

const campaignMap = computed(() => {
  const map = new Map();
  campaigns.value.forEach((campaign) => {
    map.set(campaign.id, campaign);
  });
  return map;
});

const formatDate = (value) => {
  if (!value) return 'Sem registo';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parsed);
};

const resolveLocation = (donation) => {
  if (!donation) return 'Local não informado';
  if (donation.campaignLocation) return donation.campaignLocation;
  if (donation.campaignId && campaignMap.value.has(donation.campaignId)) {
    return campaignMap.value.get(donation.campaignId).location || 'Local não informado';
  }
  return 'Local não informado';
};

watch(
  [currentDonorId, accessToken],
  ([donorId, token]) => {
    if (!donorId || !token) return;
    donorsStore.refreshDonationHistory(donorId, token);
  },
  { immediate: true }
);
</script>

<template>
  <div class="max-w-300 mx-auto space-y-6 pb-10">
    <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10 overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Histórico de Doações</h2>
          <p class="text-sm text-gray-500 mt-1">Registo das suas contribuições para a comunidade.</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden md:flex bg-gray-50 border border-gray-100 rounded-2xl p-1.5 gap-1 shadow-inner">
            <div class="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-bold text-rose-600">Todas</div>
            <div class="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">Este Ano</div>
          </div>
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-3 md:py-2.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm w-full md:w-auto">
            <History class="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-rose-50/50 p-4 rounded-[20px] border border-rose-100/50">
          <div class="text-[11px] uppercase tracking-widest text-rose-600 font-bold mb-1">Total Doado</div>
          <div class="text-2xl font-black text-gray-900 tracking-tight">{{ Number(totalDonationLiters).toFixed(2) }} <span class="text-sm text-gray-500 font-semibold">Litros</span></div>
        </div>
        <div class="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100/50">
          <div class="text-[11px] uppercase tracking-widest text-blue-600 font-bold mb-1">Doações</div>
          <div class="text-2xl font-black text-gray-900 tracking-tight">{{ donationCount }}</div>
        </div>
        <div class="bg-amber-50/50 p-4 rounded-[20px] border border-amber-100/50">
          <div class="text-[11px] uppercase tracking-widest text-amber-600 font-bold mb-1">Última Doação</div>
          <div class="text-lg font-black text-gray-900 tracking-tight mt-1">{{ formatDate(latestDonationDate) }}</div>
        </div>
      </div>

      <div class="overflow-x-auto pb-4 custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-175">
          <thead>
            <tr class="bg-gray-50/80 border-y border-gray-100">
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest rounded-tl-2xl">Data & Local</th>
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Detalhes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/80">
            <tr v-for="donation in donationHistory" :key="donation.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="py-5 px-5">
                <div class="font-bold text-gray-900">{{ formatDate(donation.date) }}</div>
                <div class="text-sm text-gray-500 font-medium mt-0.5">{{ resolveLocation(donation) }}</div>
              </td>
              <td class="py-5 px-5">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                    <Droplet class="w-4 h-4" stroke-width="2.5" />
                  </div>
                  <div>
                    <div class="font-bold text-gray-900 text-sm">{{ Number(donation.liters || 0).toFixed(2) }} L</div>
                    <div class="text-[12px] text-gray-500 font-medium">{{ donation.campaignTitle || 'Campanha não informada' }}</div>
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="donationHistory.length === 0">
              <td colspan="2" class="py-10 text-center text-sm text-gray-500">
                Sem doações registadas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Histórico de Doações</h2>
          <p class="text-sm text-gray-500 mt-1">Registo das suas contribuições para a comunidade.</p>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden md:flex bg-gray-50 border border-gray-100 rounded-2xl p-1.5 gap-1 shadow-inner">
            <div class="px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-bold text-rose-600">Todas</div>
            <div class="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 cursor-pointer transition-colors">Este Ano</div>
          </div>
          <button class="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-3 md:py-2.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm w-full md:w-auto">
            <History class="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-rose-50/50 p-4 rounded-[20px] border border-rose-100/50">
          <div class="text-[11px] uppercase tracking-widest text-rose-600 font-bold mb-1">Total Doado</div>
          <div class="text-2xl font-black text-gray-900 tracking-tight">{{ Number(totalDonationLiters).toFixed(2) }} <span class="text-sm text-gray-500 font-semibold">Litros</span></div>
        </div>
        <div class="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100/50">
          <div class="text-[11px] uppercase tracking-widest text-blue-600 font-bold mb-1">Doações</div>
          <div class="text-2xl font-black text-gray-900 tracking-tight">{{ donationCount }}</div>
        </div>
        <div class="bg-amber-50/50 p-4 rounded-[20px] border border-amber-100/50">
          <div class="text-[11px] uppercase tracking-widest text-amber-600 font-bold mb-1">Última Doação</div>
          <div class="text-lg font-black text-gray-900 tracking-tight mt-1">{{ formatDate(latestDonationDate) }}</div>
        </div>
      </div>

      <div class="overflow-x-auto pb-4 custom-scrollbar">
        <table class="w-full text-left border-collapse min-w-175">
          <thead>
            <tr class="bg-gray-50/80 border-y border-gray-100">
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest rounded-tl-2xl">Data & Local</th>
              <th class="py-4 px-5 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Detalhes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/80">
            <tr v-for="donation in donationHistory" :key="donation.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="py-5 px-5">
                <div class="font-bold text-gray-900">{{ formatDate(donation.date) }}</div>
                <div class="text-sm text-gray-500 font-medium mt-0.5">{{ resolveLocation(donation) }}</div>
              </td>
              <td class="py-5 px-5">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                    <Droplet class="w-4 h-4" stroke-width="2.5" />
                  </div>
                  <div>
                    <div class="font-bold text-gray-900 text-sm">{{ Number(donation.liters || 0).toFixed(2) }} L</div>
                    <div class="text-[12px] text-gray-500 font-medium">{{ donation.campaignTitle || 'Campanha não informada' }}</div>
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="donationHistory.length === 0">
              <td colspan="2" class="py-10 text-center text-sm text-gray-500">
                Sem doações registadas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
