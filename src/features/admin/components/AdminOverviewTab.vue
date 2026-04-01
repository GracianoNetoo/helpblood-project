<script setup>
import { ClipboardList, UserRound } from 'lucide-vue-next';

defineProps({
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
  donorNameById: { type: Function, required: true }
});

defineEmits(['change-tab', 'approve-request', 'cancel-appointment', 'toggle-donor-status', 'remove-campaign']);
</script>

<template>
  <section class="max-w-300 mx-auto space-y-6 md:space-y-8 pb-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 bg-linear-to-br from-[#0F172A] to-[#1E293B] rounded-4xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-700/50">
        <div class="absolute top-0 right-0 w-125 h-125 bg-slate-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
        <div class="absolute bottom-0 left-0 w-75 h-75 bg-blue-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4"></div>

        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 w-fit shadow-sm">
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-[11px] font-bold text-emerald-50 uppercase tracking-widest">Sistema ativo</span>
          </div>

          <h2 class="text-3xl md:text-[38px] font-extrabold tracking-tight mb-4 leading-tight">Painel de Administracao</h2>
          <p class="text-gray-300 max-w-lg text-[15px] leading-relaxed">Monitore pedidos, agendamentos e a saude operacional do sistema em tempo real.</p>

          <div class="mt-8 flex flex-wrap gap-3">
            <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">Pedidos pendentes: {{ pendingRequestsCount }}</div>
            <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">Agendamentos ativos: {{ totalAppointments }}</div>
            <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">Doadores ativos: {{ activeDonors }}</div>
            <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">Campanhas ativas: {{ activeCampaigns }}</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        <div class="bg-white rounded-4xl p-6 border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div class="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-6 border border-slate-200/60">
            <ClipboardList class="w-6 h-6" stroke-width="2.5" />
          </div>
          <div>
            <div class="text-[13px] font-semibold text-gray-500 mb-1.5">Pedidos de Ajuda</div>
            <div class="text-4xl font-extrabold text-gray-900 flex items-baseline gap-2 tracking-tight">{{ totalRequests }}</div>
          </div>
        </div>

        <div class="bg-white rounded-4xl p-6 border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100/50">
            <UserRound class="w-6 h-6" stroke-width="2.5" />
          </div>
          <div>
            <div class="text-[13px] font-semibold text-gray-500 mb-1.5">Doadores ativos</div>
            <div class="text-4xl font-extrabold text-gray-900 flex items-baseline gap-2 tracking-tight">{{ activeDonors }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="p-6 md:p-8 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Pedidos pendentes</h3>
            <p class="text-sm text-gray-500 mt-1">Aguardando aprovacao do admin.</p>
          </div>
          <button @click="$emit('change-tab', 'requests')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
        </div>

        <div class="p-6 md:p-8 pt-0 space-y-3">
          <div v-if="pendingRequests.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem pedidos pendentes.
          </div>
          <div v-else v-for="request in latestRequests" :key="request.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
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
            <p class="text-sm text-gray-500 mt-1">Ultimos agendamentos confirmados.</p>
          </div>
          <button @click="$emit('change-tab', 'appointments')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
        </div>

        <div class="p-6 md:p-8 pt-0 space-y-3">
          <div v-if="scheduledAppointments.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem campanhas marcados.
          </div>
          <div v-else v-for="apt in latestAppointments" :key="apt.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ apt.hospital || 'Hospital' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ donorNameById(apt.donorId) }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ apt.date }} • {{ apt.time || 'Horario' }}</div>
              <div class="text-[11px] text-gray-400 mt-1">{{ apt.status || 'confirmado' }}</div>
            </div>
            <button @click="$emit('cancel-appointment', apt.id)" class="text-[12px] font-semibold text-slate-700 hover:text-slate-900">Cancelar</button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="p-6 md:p-8 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Doadores recentes</h3>
            <p class="text-sm text-gray-500 mt-1">Ultimos cadastros na plataforma.</p>
          </div>
          <button @click="$emit('change-tab', 'donors')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
        </div>

        <div class="p-6 md:p-8 pt-0 space-y-3">
          <div v-if="donors.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem doadores registados.
          </div>
          <div v-else v-for="donor in latestDonors" :key="donor.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ donor.nome || 'Doador' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ donor.tipo_sanguineo || 'N/A' }} • {{ donor.provincia || 'Provincia' }}</div>
              <div class="text-[11px] text-gray-400 mt-1">Status: {{ donor.status || 'ativo' }}</div>
            </div>
            <button @click="$emit('toggle-donor-status', donor.id)" class="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700">
              {{ donor.status === 'ativo' ? 'Colocar em repouso' : 'Ativar' }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div class="p-6 md:p-8 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Campanhas recentes</h3>
            <p class="text-sm text-gray-500 mt-1">Últimas campanhas criadas.</p>
          </div>
          <button @click="$emit('change-tab', 'campaigns')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todas</button>
        </div>

        <div class="p-6 md:p-8 pt-0 space-y-3">
          <div v-if="campaigns.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
            Sem campanhas registadas.
          </div>
          <div v-else v-for="camp in latestCampaigns" :key="camp.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
            <div>
              <div class="text-sm font-bold text-gray-900">{{ camp.title || 'Campanha' }}</div>
              <div class="text-[12px] text-gray-500 mt-1">{{ camp.location || 'Local' }} • {{ camp.dateISO || 'Data' }}</div>
              <div class="text-[11px] text-gray-400 mt-1">Status: {{ camp.status || 'ativo' }}</div>
            </div>
            <button @click="$emit('remove-campaign', camp.id)" class="text-[12px] font-semibold text-rose-600 hover:text-rose-700">
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
