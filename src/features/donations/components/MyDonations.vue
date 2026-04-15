<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { Gift, History, Droplet, Sparkles, Trophy } from 'lucide-vue-next';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useDonorsStore } from '@/features/user/store/donorsStore';
import { useCampaignsStore } from '@/features/events/store/campaignsStore';
import { useRewardsStore } from '@/features/donations/store/rewardsStore';

const authStore = useAuthStore();
const donorsStore = useDonorsStore();
const campaignsStore = useCampaignsStore();
const rewardsStore = useRewardsStore();

const { currentDonorId, accessToken } = storeToRefs(authStore);
const { donors } = storeToRefs(donorsStore);
const { campaigns } = storeToRefs(campaignsStore);
const {
  rewardCatalog,
  myRewardAttempts,
  rewardStatus,
  isClaiming,
  isLoadingCatalog,
  isLoadingStatus,
  isLoadingMyAttempts,
  lastSyncError: rewardsSyncError
} = storeToRefs(rewardsStore);

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

const recentRewardAttempts = computed(() => myRewardAttempts.value.slice(0, 6));
const visibleRewards = computed(() => rewardCatalog.value.filter((reward) => reward.isActive).slice(0, 6));
const canClaimReward = computed(() => {
  return Boolean(accessToken.value)
    && Number(rewardStatus.value.availableAttempts || 0) > 0
    && Number(rewardStatus.value.totalDonations || donationCount.value) > 0
    && visibleRewards.value.length > 0;
});

const rewardEligibilityMessage = computed(() => {
  if (!accessToken.value) return 'Inicie sessão para consultar e resgatar recompensas.';
  if (Number(rewardStatus.value.totalDonations || donationCount.value) < 1) {
    return 'A primeira doação desbloqueia a sua entrada no sistema de recompensas.';
  }
  if (visibleRewards.value.length < 1) {
    return 'O catálogo está a ser preparado. Assim que houver prémios ativos, poderá usar a sua tentativa.';
  }
  if (Number(rewardStatus.value.availableAttempts || 0) < 1) {
    return 'Já usou a tentativa disponível. Uma nova doação desbloqueia o próximo ciclo.';
  }
  return 'Pode tentar uma recompensa agora.';
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

const formatDateTime = (value) => {
  if (!value) return 'Sem registo';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const rewardTypeLabel = (rewardType) => {
  if (rewardType === 'consulta_gratuita') return 'Consulta gratuita';
  if (rewardType === 'agradecimento') return 'Agradecimento';
  return 'Cupom';
};

const rarityLabel = (rarity) => {
  if (rarity === 'epico') return 'Épico';
  if (rarity === 'raro') return 'Raro';
  return 'Comum';
};

const claimReward = async () => {
  if (!canClaimReward.value) return;
  await rewardsStore.claimMyReward(accessToken.value, currentDonorIdValue.value);
};

watch(
  [currentDonorId, accessToken],
  ([donorId, token]) => {
    if (!donorId || !token) return;
    donorsStore.refreshDonationHistory(donorId, token);
    rewardsStore.refreshRewardCatalog(token);
    rewardsStore.refreshMyRewardStatus(token);
    rewardsStore.refreshMyRewardAttempts(donorId, token);
  },
  { immediate: true }
);
</script>

<template>
  <div class="max-w-300 mx-auto space-y-6 pb-10">
    <div v-if="rewardsSyncError" class="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
      Não foi possível sincronizar as recompensas agora. {{ rewardsSyncError }}
    </div>

    <section class="rounded-4xl border border-violet-200/80 bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.18),_transparent_42%),linear-gradient(135deg,_#ffffff,_#faf5ff_55%,_#f5f3ff)] p-6 md:p-8 shadow-[0_8px_30px_rgba(76,29,149,0.08)]">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-violet-700">
            <Sparkles class="w-3.5 h-3.5" />
            Recompensas do doador
          </div>
          <h2 class="mt-4 text-3xl md:text-[34px] font-black tracking-tight text-gray-900">Cada nova doação pode abrir uma surpresa para si.</h2>
          <p class="mt-3 text-sm md:text-base text-gray-600 leading-relaxed">
            O sistema usa tentativas geradas pelas suas doações. Quando uma tentativa é consumida, o sorteio é feito no servidor com regras auditáveis e stock controlado.
          </p>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div class="text-[11px] uppercase tracking-widest text-violet-600 font-bold">Tentativas disponíveis</div>
              <div class="mt-2 text-3xl font-black text-gray-900" :class="{ 'animate-pulse text-gray-300': isLoadingStatus }">{{ isLoadingStatus ? '...' : rewardStatus.availableAttempts }}</div>
            </div>
            <div class="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div class="text-[11px] uppercase tracking-widest text-amber-600 font-bold">Falhas seguidas</div>
              <div class="mt-2 text-3xl font-black text-gray-900" :class="{ 'animate-pulse text-gray-300': isLoadingStatus }">{{ isLoadingStatus ? '...' : rewardStatus.failedStreak }}</div>
            </div>
            <div class="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div class="text-[11px] uppercase tracking-widest text-emerald-600 font-bold">Prémios ganhos</div>
              <div class="mt-2 text-3xl font-black text-gray-900" :class="{ 'animate-pulse text-gray-300': isLoadingStatus }">{{ isLoadingStatus ? '...' : rewardStatus.totalWins }}</div>
            </div>
          </div>
        </div>

        <div class="w-full lg:max-w-sm rounded-[28px] border border-violet-200 bg-white/90 p-5 shadow-[0_8px_24px_rgba(76,29,149,0.08)]">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Estado atual</div>
              <div class="mt-1 text-lg font-black text-gray-900">Resgate de recompensa</div>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <Gift class="w-5 h-5" />
            </div>
          </div>

          <p class="mt-4 text-sm text-gray-600 leading-relaxed">{{ rewardEligibilityMessage }}</p>

          <button
            type="button"
            class="mt-5 w-full rounded-2xl bg-violet-600 text-white font-bold py-3.5 hover:bg-violet-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="!canClaimReward || isClaiming"
            @click="claimReward"
          >
            {{ isClaiming ? 'A processar tentativa...' : 'Tentar recompensa agora' }}
          </button>

          <div class="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-3 text-[12px] text-violet-900">
            <div class="font-bold">Último resultado</div>
            <div class="mt-1">
              {{ rewardStatus.lastRewardTitle || 'Ainda não houve prémio registado para esta conta.' }}
            </div>
            <div class="mt-1 text-violet-700">
              {{ formatDateTime(rewardStatus.lastAttemptAt) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
      <div class="rounded-4xl border border-gray-200/70 bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 class="text-2xl font-extrabold text-gray-900 tracking-tight">Catálogo elegível</h3>
            <p class="text-sm text-gray-500 mt-1">Estas são as recompensas ativas com stock disponível neste momento.</p>
          </div>
          <div class="hidden md:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <Gift class="w-4 h-4" />
            {{ visibleRewards.length }} ativas
          </div>
        </div>

        <div v-if="isLoadingCatalog && visibleRewards.length === 0" class="md:col-span-2 flex items-center justify-center py-12">
          <div class="text-sm text-gray-400 font-medium animate-pulse">A carregar catálogo...</div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="reward in visibleRewards"
            :key="reward.id"
            class="rounded-[28px] border border-gray-200 bg-[linear-gradient(180deg,_#ffffff,_#fafafa)] p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-[11px] uppercase tracking-widest font-bold text-violet-600">{{ rewardTypeLabel(reward.rewardType) }}</div>
                <div class="mt-2 text-lg font-black text-gray-900">{{ reward.title }}</div>
              </div>
              <div class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest" :class="reward.rarity === 'epico' ? 'bg-amber-100 text-amber-800' : reward.rarity === 'raro' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'">
                {{ rarityLabel(reward.rarity) }}
              </div>
            </div>

            <p class="mt-3 text-sm text-gray-500 leading-relaxed">{{ reward.description || 'Sem descrição adicional.' }}</p>

            <div class="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              <span class="rounded-full bg-gray-100 px-2.5 py-1">Stock {{ reward.quantityAvailable }}</span>
              <span class="rounded-full bg-gray-100 px-2.5 py-1">Peso {{ reward.weight }}</span>
              <span v-if="reward.guaranteedAfterFailures" class="rounded-full bg-rose-50 text-rose-700 px-2.5 py-1">
                Garantida após {{ reward.guaranteedAfterFailures }}
              </span>
            </div>
          </div>

          <div v-if="visibleRewards.length === 0" class="md:col-span-2 rounded-[28px] border border-dashed border-gray-200 bg-gray-50/70 px-5 py-10 text-center text-sm font-medium text-gray-500">
            Ainda não existem recompensas ativas disponíveis para sorteio.
          </div>
        </div>
      </div>

      <div class="rounded-4xl border border-gray-200/70 bg-white p-6 md:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
        <div class="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 class="text-2xl font-extrabold text-gray-900 tracking-tight">Histórico de tentativas</h3>
            <p class="text-sm text-gray-500 mt-1">Cada tentativa fica registada para auditoria e transparência.</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center">
            <Trophy class="w-5 h-5" />
          </div>
        </div>

        <div v-if="isLoadingMyAttempts && recentRewardAttempts.length === 0" class="flex items-center justify-center py-10">
          <div class="text-sm text-gray-400 font-medium animate-pulse">A carregar histórico...</div>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="attempt in recentRewardAttempts"
            :key="attempt.id"
            class="rounded-[24px] border px-4 py-4"
            :class="attempt.status === 'ganhou' ? 'border-emerald-200 bg-emerald-50/60' : 'border-amber-200 bg-amber-50/60'"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-sm font-extrabold text-gray-900">
                  {{ attempt.status === 'ganhou' ? attempt.rewardTitle || 'Recompensa recebida' : 'Tentativa sem prémio' }}
                </div>
                <div class="mt-1 text-[12px] font-medium" :class="attempt.status === 'ganhou' ? 'text-emerald-700' : 'text-amber-700'">
                  {{ attempt.status === 'ganhou' ? `${rewardTypeLabel(attempt.rewardType)} · ${rarityLabel(attempt.rewardRarity)}` : 'Continue a doar para desbloquear uma nova tentativa.' }}
                </div>
              </div>
              <div class="text-right text-[12px] text-gray-500">
                {{ formatDateTime(attempt.attemptedAt) }}
              </div>
            </div>
          </div>

          <div v-if="recentRewardAttempts.length === 0" class="rounded-[24px] border border-dashed border-gray-200 bg-gray-50/70 px-5 py-10 text-center text-sm font-medium text-gray-500">
            Ainda não existem tentativas de recompensa registadas.
          </div>
        </div>
      </div>
    </section>

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
