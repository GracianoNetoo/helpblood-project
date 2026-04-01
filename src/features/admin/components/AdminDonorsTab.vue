<script setup>
import { Sparkles, Users, AlertTriangle, UserRound, Activity, Droplets, Search, MapPin, Phone, Mail } from 'lucide-vue-next';

defineProps({
  totalDonors: { type: Number, required: true },
  activeDonors: { type: Number, required: true },
  suspendedDonorsCount: { type: Number, required: true },
  donorsWithHistoryCount: { type: Number, required: true },
  totalDonatedAcrossDonors: { type: Number, required: true },
  donors: { type: Array, required: true },
  filteredDonors: { type: Array, required: true },
  donorSearch: { type: String, required: true },
  donorStatusFilter: { type: String, required: true },
  donationMin: { type: Number, required: true },
  donationMax: { type: Number, required: true },
  donationStep: { type: Number, required: true },
  formatTotalDonated: { type: Function, required: true },
  getDonorInitials: { type: Function, required: true },
  getDonorStatusLabel: { type: Function, required: true },
  getDonorStatusClasses: { type: Function, required: true },
  formatDonationDate: { type: Function, required: true },
  getDonationDraftValue: { type: Function, required: true },
  getDonationErrorFor: { type: Function, required: true },
  canSaveDonation: { type: Function, required: true },
  formatLiters: { type: Function, required: true }
});

defineEmits([
  'update:donor-search',
  'update:donor-status-filter',
  'ensure-donation-draft',
  'update-donation-draft',
  'clear-donation-draft',
  'apply-donation-preset',
  'open-donation-modal',
  'toggle-donor-status',
  'remove-donor'
]);
</script>

<template>
  <section class="max-w-300 mx-auto pb-10">
    <div class="space-y-6">
      <div class="relative overflow-hidden rounded-4xl border border-rose-100/70 bg-linear-to-br from-[#2a0f0f] via-[#971818] to-[#4b3232] p-6 md:p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        <div class="absolute -top-18 right-0 h-48 w-48 rounded-full bg-rose-400/12 blur-3xl"></div>
        <div class="absolute -bottom-18 left-0 h-44 w-44 rounded-full bg-rose-400/10 blur-3xl"></div>
        <div class="relative flex flex-col gap-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white-100">
                <Sparkles class="w-3.5 h-3.5" />
                Centro de doadores
              </div>
              <h2 class="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight">Gestão visual da base de doadores</h2>
              <p class="mt-2 max-w-2xl text-sm md:text-[15px] text-slate-300">Organize a operação com melhor leitura de status, historico de doação e contactos essenciais numa única area.</p>
            </div>
            <div class="inline-flex items-center gap-2 self-start rounded-full border border-white-300/20 bg-white-400/10 px-4 py-2 text-[12px] font-bold text-white-100">
              <Users class="w-4 h-4" />
              {{ totalDonors }} doadores registados
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl p-4">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">Ativos</span>
                <UserRound class="w-4 h-4 text-emerald-200" />
              </div>
              <div class="mt-3 text-3xl font-black tracking-tight">{{ activeDonors }}</div>
              <p class="mt-1 text-[12px] text-slate-300">Disponíveis para novas campanhas e convocatorias.</p>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl p-4">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">Em repouso</span>
                <AlertTriangle class="w-4 h-4 text-amber-200" />
              </div>
              <div class="mt-3 text-3xl font-black tracking-tight">{{ suspendedDonorsCount }}</div>
              <p class="mt-1 text-[12px] text-slate-300">Perfis fora de circulação no momento.</p>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl p-4">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">Com historico</span>
                <Activity class="w-4 h-4 text-sky-200" />
              </div>
              <div class="mt-3 text-3xl font-black tracking-tight">{{ donorsWithHistoryCount }}</div>
              <p class="mt-1 text-[12px] text-slate-300">Doadores com pelo menos uma doação registada.</p>
            </div>

            <div class="rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl p-4">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">Volume total</span>
                <Droplets class="w-4 h-4 text-rose-200" />
              </div>
              <div class="mt-3 text-3xl font-black tracking-tight">{{ formatTotalDonated(totalDonatedAcrossDonors) }} <span class="text-lg font-bold text-slate-300">L</span></div>
              <p class="mt-1 text-[12px] text-slate-300">Soma de litros registados pelos doadores.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-4xl border border-gray-200/70 shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-6 md:p-8">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 class="text-xl font-extrabold text-gray-900 tracking-tight">Doadores</h3>
            <p class="text-sm text-gray-500 mt-1">Pesquisa rapida, filtros de status e cards com hierarquia visual mais clara.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] font-bold text-gray-600">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              {{ filteredDonors.length }} visiveis
            </span>
            <span class="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-[12px] font-bold text-emerald-700">Base ativa</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
          <label class="relative block">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input :value="donorSearch" @input="$emit('update:donor-search', $event.target.value)" type="text" placeholder="Pesquisar por nome, sangue, localizacao, telefone ou email" class="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3.5 text-[14px] text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all" />
          </label>
          <div class="flex flex-wrap gap-2">
            <button @click="$emit('update:donor-status-filter', 'todos')" class="px-4 py-3 rounded-2xl text-[12px] font-bold border transition-all" :class="donorStatusFilter === 'todos' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'">Todos</button>
            <button @click="$emit('update:donor-status-filter', 'ativo')" class="px-4 py-3 rounded-2xl text-[12px] font-bold border transition-all" :class="donorStatusFilter === 'ativo' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/15' : 'bg-white text-emerald-700 border-emerald-100 hover:bg-emerald-50'">Ativos</button>
            <button @click="$emit('update:donor-status-filter', 'suspenso')" class="px-4 py-3 rounded-2xl text-[12px] font-bold border transition-all" :class="donorStatusFilter === 'suspenso' ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/15' : 'bg-white text-amber-700 border-amber-100 hover:bg-amber-50'">Em repouso</button>
          </div>
        </div>

        <div v-if="donors.length === 0" class="mt-6 py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">Sem doadores registados.</div>
        <div v-else-if="filteredDonors.length === 0" class="mt-6 py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">Nenhum doador encontrado com os filtros atuais.</div>

        <div v-else class="mt-6 space-y-4">
          <div v-for="donor in filteredDonors" :key="donor.id" class="group relative overflow-hidden rounded-[30px] border border-gray-200/80 bg-linear-to-br from-white to-gray-50/60 p-5 md:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
            <div class="relative flex flex-col xl:flex-row gap-5 xl:gap-6">
              <div class="flex-1 min-w-0">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div class="flex items-start gap-4">
                    <div class="w-14 h-14 rounded-3xl bg-linear-to-br from-rose-500 via-rose-600 to-red-700 text-white flex items-center justify-center font-black text-lg shadow-[0_12px_24px_rgba(222,18,22,0.20)]">{{ getDonorInitials(donor.nome) }}</div>
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h3 class="text-lg font-extrabold text-gray-900 truncate">{{ donor.nome || 'Doador' }}</h3>
                        <span class="inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">{{ donor.tipo_sanguineo || 'N/A' }}</span>
                        <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold" :class="getDonorStatusClasses(donor.status)">{{ getDonorStatusLabel(donor.status) }}</span>
                      </div>
                      <p class="mt-1 text-[13px] text-gray-500">{{ donor.doacao_sangue || 'Historico de doação não informado' }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div class="rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 min-w-28">
                      <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Total</div>
                      <div class="mt-1 text-lg font-extrabold text-gray-900">{{ formatTotalDonated(donor.totalDonationLiters) }} <span class="text-[11px] font-bold text-gray-400">L</span></div>
                    </div>
                    <div class="rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 min-w-28">
                      <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Última</div>
                      <div class="mt-1 text-sm font-extrabold text-gray-900">{{ donor.lastDonationLiters !== null && typeof donor.lastDonationLiters !== 'undefined' ? `${donor.lastDonationLiters} L` : 'Sem registo' }}</div>
                    </div>
                    <div class="rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 min-w-28 col-span-2 sm:col-span-1">
                      <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Data</div>
                      <div class="mt-1 text-sm font-extrabold text-gray-900">{{ formatDonationDate(donor.lastDonationDate) }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="rounded-2xl border border-gray-100 bg-white/85 px-4 py-3">
                    <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400"><MapPin class="w-3.5 h-3.5" />Localização</div>
                    <div class="mt-2 text-[13px] font-semibold text-gray-700">{{ donor.provincia || 'Provincia' }} • {{ donor.municipio || 'Municipio' }}</div>
                  </div>
                  <div class="rounded-2xl border border-gray-100 bg-white/85 px-4 py-3">
                    <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400"><Phone class="w-3.5 h-3.5" />Telefone</div>
                    <div class="mt-2 text-[13px] font-semibold text-gray-700">{{ donor.telefone || 'Não informado' }}</div>
                  </div>
                  <div class="rounded-2xl border border-gray-100 bg-white/85 px-4 py-3">
                    <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400"><Mail class="w-3.5 h-3.5" />Email</div>
                    <div class="mt-2 text-[13px] font-semibold text-gray-700 break-all">{{ donor.email || 'Sem email' }}</div>
                  </div>
                </div>

                <div class="mt-4 rounded-2xl border border-gray-100 bg-white/85 px-4 py-3 text-[12px] text-gray-600">
                  <span v-if="donor.lastDonationCampaignTitle">Última campanha registada: <span class="font-bold text-gray-900">{{ donor.lastDonationCampaignTitle }}</span></span>
                  <span v-else>Última campanha registada: <span class="font-bold text-gray-900">Não informado</span></span>
                </div>
              </div>

              <div class="xl:w-72 shrink-0">
                <div class="rounded-[26px] border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-4 shadow-[0_10px_24px_rgba(16,185,129,0.06)]">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <label class="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Litros na última campanha</label>
                      <p class="text-[11px] text-emerald-800/80 mt-1">Referência: 0.45 L e o volume padrão.</p>
                    </div>
                    <Droplets class="w-5 h-5 text-rose-600" />
                  </div>

                  <div class="relative mt-3">
                    <input :value="getDonationDraftValue(donor.id, formatLiters(donor.lastDonationLiters))" @focus="$emit('ensure-donation-draft', donor.id)" @input="$emit('update-donation-draft', { donorId: donor.id, value: $event.target.value })" type="number" :min="donationMin" :max="donationMax" :step="donationStep" placeholder="0.45" class="w-full bg-white border border-rose-100 text-gray-900 text-[13px] rounded-2xl pl-4 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium shadow-sm" />
                    <button type="button" @click="$emit('clear-donation-draft', donor.id)" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors" aria-label="Limpar valor">
                      <span class="text-[11px] font-bold">X</span>
                    </button>
                  </div>

                  <div class="mt-3 flex flex-wrap gap-2">
                    <button @click="$emit('apply-donation-preset', { donorId: donor.id, value: 0.45 })" class="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-colors">0.45 L</button>
                    <button @click="$emit('apply-donation-preset', { donorId: donor.id, value: 0.5 })" class="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-colors">0.50 L</button>
                    <button @click="$emit('apply-donation-preset', { donorId: donor.id, value: 0.6 })" class="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-colors">0.60 L</button>
                  </div>

                  <p v-if="getDonationErrorFor(donor.id, formatLiters(donor.lastDonationLiters))" class="text-[11px] text-rose-600 font-bold mt-3">{{ getDonationErrorFor(donor.id, formatLiters(donor.lastDonationLiters)) }}</p>

                  <button @click="$emit('open-donation-modal', donor.id)" :disabled="!canSaveDonation(donor.id, formatLiters(donor.lastDonationLiters))" class="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-4 py-3 text-[12px] font-bold transition-all shadow-[0_10px_20px_rgba(16,185,129,0.18)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-emerald-600">Guardar doação</button>
                </div>

                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                  <button @click="$emit('toggle-donor-status', donor.id)" class="px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">{{ donor.status === 'ativo' ? 'Colocar em repouso' : 'Ativar' }}</button>
                  <button @click="$emit('remove-donor', donor.id)" class="px-4 py-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 font-semibold hover:bg-rose-100 transition-colors">Remover</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
