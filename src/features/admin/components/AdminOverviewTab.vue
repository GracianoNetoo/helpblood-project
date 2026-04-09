<script setup>
import { computed } from 'vue';
import { BarChart3, ClipboardList, Clock3, Flame, Map, Trophy, UserRound } from 'lucide-vue-next';

const {
  pendingRequestsCount,
  totalAppointments,
  activeDonors,
  activeCampaigns,
  totalRequests,
  pendingRequests,
  latestRequests,
  scheduledAppointments,
  latestAppointments,
  donors,
  latestDonors,
  campaigns,
  latestCampaigns,
  donorNameById,
  totalDonationsThisMonthCount,
  totalDonationsThisMonthLiters,
  mostActiveDonors,
  campaignsWithHighestAdhesion,
  provinceHeatmap,
  approvedVsRejectedStats,
  averageRequestResponseLabel
} = defineProps({
  pendingRequestsCount: { type: Number, required: true },
  totalAppointments: { type: Number, required: true },
  activeDonors: { type: Number, required: true },
  activeCampaigns: { type: Number, required: true },
  totalRequests: { type: Number, required: true },
  pendingRequests: { type: Array, required: true },
  latestRequests: { type: Array, required: true },
  scheduledAppointments: { type: Array, required: true },
  latestAppointments: { type: Array, required: true },
  donors: { type: Array, required: true },
  latestDonors: { type: Array, required: true },
  campaigns: { type: Array, required: true },
  latestCampaigns: { type: Array, required: true },
  donorNameById: { type: Function, required: true },
  totalDonationsThisMonthCount: { type: Number, required: true },
  totalDonationsThisMonthLiters: { type: Number, required: true },
  mostActiveDonors: { type: Array, required: true },
  campaignsWithHighestAdhesion: { type: Array, required: true },
  provinceHeatmap: { type: Array, required: true },
  approvedVsRejectedStats: { type: Object, required: true },
  averageRequestResponseLabel: { type: String, required: true }
});

defineEmits(['change-tab', 'approve-request', 'cancel-appointment', 'toggle-donor-status', 'remove-campaign']);

const formatLiters = (value) => Number(value || 0).toFixed(2);

const totalReviewedRequests = computed(() => {
  return (approvedVsRejectedStats.approved || 0) + (approvedVsRejectedStats.rejected || 0);
});

const approvalRate = computed(() => {
  if (!totalReviewedRequests.value) return '0%';
  const rate = (approvedVsRejectedStats.approved / totalReviewedRequests.value) * 100;
  return `${Math.round(rate)}%`;
});

const getHeatStyle = (intensity) => {
  const normalized = Math.max(0.12, Math.min(0.9, Number(intensity) || 0));
  return {
    background: `linear-gradient(135deg, rgba(244,63,94,${normalized * 0.75}), rgba(15,23,42,0.08))`
  };
};
</script>

<template>
  <section class="max-w-300 mx-auto space-y-6 md:space-y-8 pb-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-8 bg-linear-to-br from-[#0F172A] via-[#172554] to-[#1D4ED8] rounded-4xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-700/50">
        <div class="absolute -top-20 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-[90px]"></div>
        <div class="absolute -bottom-24 left-0 h-56 w-56 rounded-full bg-rose-500/12 blur-[90px]"></div>

        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 w-fit shadow-sm">
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-[11px] font-bold text-emerald-50 uppercase tracking-widest">Supabase em tempo real</span>
          </div>

          <h2 class="text-3xl md:text-[38px] font-extrabold tracking-tight mb-4 leading-tight">Painel de métricas da operação</h2>
          <p class="text-slate-200 max-w-2xl text-[15px] leading-relaxed">
            Acompanhe volume do mês, adesão às campanhas, distribuição por província e velocidade de resposta aos pedidos com base nos dados reais da plataforma.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">
              {{ totalDonationsThisMonthCount }} doações neste mês
            </div>
            <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">
              {{ formatLiters(totalDonationsThisMonthLiters) }} L registados
            </div>
            <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">
              Tempo médio de resposta: {{ averageRequestResponseLabel }}
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        <div class="bg-white rounded-4xl p-6 border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div class="flex items-center justify-between">
            <span class="text-[13px] font-semibold text-gray-500">Doações no mês</span>
            <Flame class="w-5 h-5 text-rose-600" />
          </div>
          <div class="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight">{{ formatLiters(totalDonationsThisMonthLiters) }} <span class="text-lg text-gray-400">L</span></div>
          <p class="mt-2 text-sm text-gray-500">{{ totalDonationsThisMonthCount }} registos confirmados no período atual.</p>
        </div>

        <div class="bg-white rounded-4xl p-6 border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div class="flex items-center justify-between">
            <span class="text-[13px] font-semibold text-gray-500">Pedidos revistos</span>
            <Clock3 class="w-5 h-5 text-sky-600" />
          </div>
          <div class="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight">{{ averageRequestResponseLabel }}</div>
          <p class="mt-2 text-sm text-gray-500">Tempo médio para aprovar ou rejeitar pedidos.</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div class="bg-white rounded-4xl border border-gray-200/60 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <div class="text-[13px] font-semibold text-gray-500">Pedidos aprovados</div>
          <ClipboardList class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="mt-4 text-4xl font-extrabold text-gray-900">{{ approvedVsRejectedStats.approved }}</div>
        <p class="mt-2 text-sm text-gray-500">Taxa de aprovação atual: {{ approvalRate }}</p>
      </div>

      <div class="bg-white rounded-4xl border border-gray-200/60 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <div class="text-[13px] font-semibold text-gray-500">Pedidos rejeitados</div>
          <BarChart3 class="w-5 h-5 text-rose-600" />
        </div>
        <div class="mt-4 text-4xl font-extrabold text-gray-900">{{ approvedVsRejectedStats.rejected }}</div>
        <p class="mt-2 text-sm text-gray-500">{{ approvedVsRejectedStats.pending }} pedidos ainda aguardam decisão.</p>
      </div>

      <div class="bg-white rounded-4xl border border-gray-200/60 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <div class="text-[13px] font-semibold text-gray-500">Doadores ativos</div>
          <UserRound class="w-5 h-5 text-amber-600" />
        </div>
        <div class="mt-4 text-4xl font-extrabold text-gray-900">{{ activeDonors }}</div>
        <p class="mt-2 text-sm text-gray-500">Perfis disponíveis para convocação imediata.</p>
      </div>

      <div class="bg-white rounded-4xl border border-gray-200/60 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between">
          <div class="text-[13px] font-semibold text-gray-500">Campanhas ativas</div>
          <Trophy class="w-5 h-5 text-violet-600" />
        </div>
        <div class="mt-4 text-4xl font-extrabold text-gray-900">{{ activeCampaigns }}</div>
        <p class="mt-2 text-sm text-gray-500">{{ totalAppointments }} agendamentos ativos em andamento.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div class="xl:col-span-4 bg-white rounded-4xl border border-gray-200/60 p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Doadores mais ativos</h3>
            <p class="text-sm text-gray-500 mt-1">Ranking por número de doações e volume acumulado.</p>
          </div>
          <button @click="$emit('change-tab', 'donors')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
        </div>

        <div v-if="mostActiveDonors.length === 0" class="mt-6 py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
          Ainda não existem doações suficientes para o ranking.
        </div>

        <div v-else class="mt-6 space-y-3">
          <div v-for="(donor, index) in mostActiveDonors" :key="donor.id" class="rounded-3xl border border-gray-100 bg-gray-50/70 px-4 py-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">#{{ index + 1 }}</p>
                <h4 class="mt-2 text-sm font-extrabold text-gray-900">{{ donor.nome }}</h4>
                <p class="mt-1 text-[12px] text-gray-500">{{ donor.provincia }}</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-extrabold text-gray-900">{{ donor.donationsCount }}</p>
                <p class="text-[11px] font-semibold text-gray-500">doações</p>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between text-[12px] text-gray-500">
              <span>{{ formatLiters(donor.totalLiters) }} L acumulados</span>
              <span>{{ donor.thisMonthCount }} neste mês</span>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-4 bg-white rounded-4xl border border-gray-200/60 p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Campanhas com maior adesão</h3>
            <p class="text-sm text-gray-500 mt-1">Combina agendamentos ativos, concluídos e doações registadas.</p>
          </div>
          <button @click="$emit('change-tab', 'campaigns')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver campanhas</button>
        </div>

        <div v-if="campaignsWithHighestAdhesion.length === 0" class="mt-6 py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
          Ainda não existem dados de adesão suficientes.
        </div>

        <div v-else class="mt-6 space-y-3">
          <div v-for="campaign in campaignsWithHighestAdhesion" :key="campaign.id" class="rounded-3xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="text-sm font-extrabold text-gray-900">{{ campaign.title }}</h4>
                <p class="mt-1 text-[12px] text-gray-500">{{ campaign.location }}</p>
              </div>
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                {{ campaign.scheduledCount + campaign.completedCount + campaign.donationCount }} ações
              </span>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2 text-center">
              <div class="rounded-2xl bg-slate-50 px-2 py-3">
                <div class="text-sm font-extrabold text-slate-900">{{ campaign.scheduledCount }}</div>
                <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Agend.</div>
              </div>
              <div class="rounded-2xl bg-emerald-50 px-2 py-3">
                <div class="text-sm font-extrabold text-emerald-700">{{ campaign.completedCount }}</div>
                <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-500">Concl.</div>
              </div>
              <div class="rounded-2xl bg-rose-50 px-2 py-3">
                <div class="text-sm font-extrabold text-rose-700">{{ campaign.donationCount }}</div>
                <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-500">Doações</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-4 bg-white rounded-4xl border border-gray-200/60 p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Mapa de calor por província</h3>
            <p class="text-sm text-gray-500 mt-1">Intensidade baseada no volume total de doações.</p>
          </div>
          <Map class="w-5 h-5 text-rose-600" />
        </div>

        <div v-if="provinceHeatmap.length === 0" class="mt-6 py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
          Ainda não existem dados por província.
        </div>

        <div v-else class="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
          <div
            v-for="province in provinceHeatmap"
            :key="province.province"
            class="rounded-3xl border border-white/60 p-4 text-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
            :style="getHeatStyle(province.intensity)"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="text-sm font-extrabold">{{ province.province }}</h4>
                <p class="mt-1 text-[12px] text-white/85">{{ province.activeDonors }} doadores ativos</p>
              </div>
              <span class="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/90">
                {{ formatLiters(province.liters) }} L
              </span>
            </div>
            <div class="mt-4 flex items-center justify-between text-[12px] text-white/85">
              <span>{{ province.donorsCount }} doadores</span>
              <span>{{ province.donationsCount }} doações</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="p-6 md:p-8 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Pedidos pendentes</h3>
            <p class="text-sm text-gray-500 mt-1">Ações rápidas para acelerar o tempo de resposta.</p>
          </div>
          <button @click="$emit('change-tab', 'requests')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
        </div>

        <div class="p-6 md:p-8 pt-0 space-y-3">
          <div v-if="pendingRequests.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem pedidos pendentes.
          </div>
          <div v-else v-for="request in latestRequests" :key="request.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anónimo' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localização não informada' }}</div>
              <div class="text-[11px] text-gray-400 mt-1">{{ request.tipo_sanguineo || 'N/A' }} • {{ request.urgencia || 'Normal' }}</div>
            </div>
            <button @click="$emit('approve-request', request.id)" class="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700">Aprovar</button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="p-6 md:p-8 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Agendamentos recentes</h3>
            <p class="text-sm text-gray-500 mt-1">Visão rápida dos compromissos ainda ativos.</p>
          </div>
          <button @click="$emit('change-tab', 'appointments')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
        </div>

        <div class="p-6 md:p-8 pt-0 space-y-3">
          <div v-if="scheduledAppointments.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem agendamentos ativos.
          </div>
          <div v-else v-for="apt in latestAppointments" :key="apt.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ apt.hospital || 'Campanha' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ donorNameById(apt.donorId) }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ apt.date }} • {{ apt.time || 'Horário' }}</div>
              <div class="text-[11px] text-gray-400 mt-1">{{ apt.status || 'confirmado' }}</div>
            </div>
            <button @click="$emit('cancel-appointment', apt.id)" class="text-[12px] font-semibold text-slate-700 hover:text-slate-900">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
