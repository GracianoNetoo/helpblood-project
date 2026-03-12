<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  LayoutDashboard,
  AlertTriangle,
  CalendarDays,
  LogOut,
  Shield,
  Users,
  Menu,
  UserRound,
  ClipboardList
} from 'lucide-vue-next';
import { useAppointmentsStore } from '../stores/appointmentsStore';
import { useHelpRequestsStore } from '../stores/helpRequestsStore';
import { useDonorsStore } from '../stores/donorsStore';

const emit = defineEmits(['logout']);

const navItems = [
  { id: 'overview', name: 'Visao Geral', icon: LayoutDashboard },
  { id: 'requests', name: 'Pedidos de Ajuda', icon: AlertTriangle },
  { id: 'donors', name: 'Doadores', icon: UserRound },
  { id: 'appointments', name: 'Agendamentos', icon: CalendarDays }
];

const activeTab = ref('overview');
const isMobileNavOpen = ref(false);

const appointmentsStore = useAppointmentsStore();
const helpRequestsStore = useHelpRequestsStore();
const donorsStore = useDonorsStore();

const { appointments } = storeToRefs(appointmentsStore);
const { requests } = storeToRefs(helpRequestsStore);
const { donors } = storeToRefs(donorsStore);

const totalAppointments = computed(() => appointments.value.length);
const totalRequests = computed(() => requests.value.length);
const pendingRequests = computed(() => requests.value.length);
const totalDonors = computed(() => donors.value.length);
const activeDonors = computed(() => donors.value.filter((donor) => donor.status === 'ativo').length);

const latestAppointments = computed(() => appointments.value.slice(0, 4));
const latestRequests = computed(() => requests.value.slice(0, 4));
const latestDonors = computed(() => donors.value.slice(0, 4));

const removeRequest = (id) => {
  helpRequestsStore.removeRequest(id);
};

const cancelAppointment = (id) => {
  appointmentsStore.cancelAppointment(id);
};

const toggleDonorStatus = (id) => {
  donorsStore.toggleStatus(id);
};

const removeDonor = (id) => {
  donorsStore.removeDonor(id);
};

const setTab = (tab) => {
  activeTab.value = tab;
  isMobileNavOpen.value = false;
};
</script>

<template>
  <div class="h-screen bg-[#FDFDFD] flex overflow-hidden font-sans selection:bg-slate-200 selection:text-slate-900">
    <!-- Sidebar -->
    <aside class="w-20 lg:w-64 bg-white/70 backdrop-blur-3xl border-r border-[#E5E7EB]/60 hidden md:flex flex-col shrink-0 transition-all duration-300 relative z-20">
      <div class="p-6 flex items-center justify-center lg:justify-start gap-4 h-24 border-b border-gray-100/50">
        <div class="flex items-center gap-2.5">
          <Shield class="w-5.5 h-5.5 text-slate-700" stroke-width="2.5" />
          <span class="text-[20px] font-black text-gray-900 tracking-tight">Admin</span>
        </div>
      </div>

      <div class="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden lg:block px-3 mb-4">Controle</span>
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="setTab(item.id)"
          class="w-full flex items-center lg:justify-start justify-center gap-3.5 p-3 rounded-2xl transition-all duration-200 group relative outline-none"
          :class="activeTab === item.id ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 text-slate-700 font-semibold' : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900 font-medium'"
        >
          <div v-if="activeTab === item.id" class="absolute -left-4 w-1 h-6 rounded-r-full bg-slate-700 hidden lg:block"></div>
          <component :is="item.icon" class="w-5.5 h-5.5 transition-transform group-hover:scale-110" :class="activeTab === item.id ? 'text-slate-700' : 'text-gray-400 group-hover:text-gray-500'" stroke-width="2" />
          <span class="hidden lg:block">{{ item.name }}</span>
        </button>
      </div>

      <div class="p-6 border-t border-gray-100/50">
        <button @click="emit('logout')" class="w-full flex items-center lg:justify-start justify-center gap-3.5 p-3 text-gray-400 hover:text-slate-700 hover:bg-slate-50 rounded-[14px] transition-all group font-medium">
          <LogOut class="w-5.5 h-5.5 transition-transform group-hover:-translate-x-1" stroke-width="2" />
          <span class="hidden lg:block">Terminar Sessao</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden ring-1 ring-gray-200/50">
      <!-- Topbar -->
      <header class="h-20 md:h-24 px-4 md:px-10 flex justify-between items-center bg-white/40 backdrop-blur-2xl border-b border-gray-200/50 sticky top-0 z-20 w-full">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Administracao</h1>
          <p class="text-[13px] md:text-sm text-gray-500 mt-0.5 hidden sm:block">Central de controle da plataforma.</p>
        </div>

        <div class="flex items-center gap-4 md:gap-6">
          <button @click="isMobileNavOpen = true" class="md:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" aria-label="Abrir menu">
            <Menu class="w-5 h-5" />
          </button>
          <div class="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-700 text-[12px] font-bold uppercase tracking-widest">
            <Users class="w-4 h-4" /> Administrador
          </div>
          <button @click="emit('logout')" class="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" aria-label="Sair">
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </header>

      <!-- Dashboard Scrollable Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth custom-scrollbar">
        <!-- Overview -->
        <section v-if="activeTab === 'overview'" class="max-w-300 mx-auto space-y-6 md:space-y-8 pb-10">
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
                  <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">Pedidos pendentes: {{ pendingRequests }}</div>
                  <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">Agendamentos ativos: {{ totalAppointments }}</div>
                  <div class="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold">Doadores ativos: {{ activeDonors }}</div>
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
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100/50">
                  <CalendarDays class="w-6 h-6" stroke-width="2.5" />
                </div>
                <div>
                  <div class="text-[13px] font-semibold text-gray-500 mb-1.5">Agendamentos</div>
                  <div class="text-4xl font-extrabold text-gray-900 flex items-baseline gap-2 tracking-tight">{{ totalAppointments }}</div>
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

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div class="p-6 md:p-8 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Pedidos recentes</h3>
                  <p class="text-sm text-gray-500 mt-1">Ultimas solicitacoes registradas.</p>
                </div>
                <button @click="setTab('requests')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
              </div>

              <div class="p-6 md:p-8 pt-0 space-y-3">
                <div v-if="requests.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
                  Sem pedidos ativos.
                </div>
                <div v-else v-for="request in latestRequests" :key="request.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                    <div class="text-[11px] text-gray-400 mt-1">{{ request.tipo_sanguineo || 'N/A' }} • {{ request.urgencia || 'Normal' }}</div>
                  </div>
                  <button @click="removeRequest(request.id)" class="text-[12px] font-semibold text-rose-600 hover:text-rose-700">Encerrar</button>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div class="p-6 md:p-8 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Agendamentos recentes</h3>
                  <p class="text-sm text-gray-500 mt-1">Ultimos agendamentos confirmados.</p>
                </div>
                <button @click="setTab('appointments')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
              </div>

              <div class="p-6 md:p-8 pt-0 space-y-3">
                <div v-if="appointments.length === 0" class="py-10 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
                  Sem agendamentos.
                </div>
                <div v-else v-for="apt in latestAppointments" :key="apt.id" class="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ apt.hospital || 'Hospital' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">{{ apt.date }} • {{ apt.time || 'Horario' }}</div>
                    <div class="text-[11px] text-gray-400 mt-1">{{ apt.status || 'confirmado' }}</div>
                  </div>
                  <button @click="cancelAppointment(apt.id)" class="text-[12px] font-semibold text-slate-700 hover:text-slate-900">Cancelar</button>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div class="p-6 md:p-8 flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">Doadores recentes</h3>
                  <p class="text-sm text-gray-500 mt-1">Ultimos cadastros na plataforma.</p>
                </div>
                <button @click="setTab('donors')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
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
                  <button @click="toggleDonorStatus(donor.id)" class="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700">
                    {{ donor.status === 'ativo' ? 'Suspender' : 'Reativar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Requests Tab -->
        <section v-else-if="activeTab === 'requests'" class="max-w-300 mx-auto pb-10">
          <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Pedidos de Ajuda</h2>
                <p class="text-sm text-gray-500 mt-1">Gerencie as solicitacoes registradas na plataforma.</p>
              </div>
              <div class="text-[12px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">Total: {{ totalRequests }}</div>
            </div>

            <div v-if="requests.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
              Sem pedidos ativos.
            </div>

            <div v-else class="space-y-4">
              <div v-for="request in requests" :key="request.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ request.tipo_sanguineo || 'N/A' }} • Urgencia: {{ request.urgencia || 'Normal' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">Contacto: {{ request.contacto || 'Nao informado' }}</div>
                    <div class="text-[12px] text-gray-400 mt-2">{{ request.motivo || 'Motivo nao informado.' }}</div>
                  </div>
                  <button @click="removeRequest(request.id)" class="self-start px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors">Encerrar</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Donors Tab -->
        <section v-else-if="activeTab === 'donors'" class="max-w-300 mx-auto pb-10">
          <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Doadores</h2>
                <p class="text-sm text-gray-500 mt-1">Gerencie os doadores registados na plataforma.</p>
              </div>
              <div class="text-[12px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">Total: {{ totalDonors }}</div>
            </div>

            <div v-if="donors.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
              Sem doadores registados.
            </div>

            <div v-else class="space-y-4">
              <div v-for="donor in donors" :key="donor.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ donor.nome || 'Doador' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ donor.tipo_sanguineo || 'N/A' }} • RH: {{ donor.rh || 'N/A' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">Localizacao: {{ donor.provincia || 'Provincia' }} • {{ donor.municipio || 'Municipio' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">Contacto: {{ donor.telefone || 'Nao informado' }} • {{ donor.email || 'Sem email' }}</div>
                    <div class="text-[12px] text-gray-400 mt-2">Status: {{ donor.status || 'ativo' }}</div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button @click="toggleDonorStatus(donor.id)" class="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors">
                      {{ donor.status === 'ativo' ? 'Suspender' : 'Reativar' }}
                    </button>
                    <button @click="removeDonor(donor.id)" class="px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Appointments Tab -->
        <section v-else class="max-w-300 mx-auto pb-10">
          <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Agendamentos</h2>
                <p class="text-sm text-gray-500 mt-1">Acompanhe todos os agendamentos registados.</p>
              </div>
              <div class="text-[12px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">Total: {{ totalAppointments }}</div>
            </div>

            <div v-if="appointments.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
              Sem agendamentos.
            </div>

            <div v-else class="space-y-4">
              <div v-for="apt in appointments" :key="apt.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ apt.hospital || 'Hospital' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">{{ apt.date }} • {{ apt.time || 'Horario' }}</div>
                    <div class="text-[12px] text-gray-400 mt-1">Status: {{ apt.status || 'confirmado' }}</div>
                  </div>
                  <button @click="cancelAppointment(apt.id)" class="self-start px-4 py-2 rounded-2xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Mobile Navigation Drawer -->
    <div v-if="isMobileNavOpen" class="fixed inset-0 z-30 md:hidden">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="isMobileNavOpen = false"></div>
      <div class="absolute right-0 top-0 h-full w-72 bg-white shadow-xl border-l border-gray-100 flex flex-col">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Shield class="w-5.5 h-5.5 text-slate-700" stroke-width="2.5" />
            <span class="text-[20px] font-black text-gray-900 tracking-tight">Admin</span>
          </div>
          <button @click="isMobileNavOpen = false" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <LogOut class="w-4 h-4 rotate-180" />
          </button>
        </div>
        <div class="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="setTab(item.id)"
            class="w-full flex items-center gap-3 p-3 rounded-[14px] transition-all text-left"
            :class="activeTab === item.id ? 'bg-slate-50 text-slate-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </button>
        </div>
        <div class="p-4 border-t border-gray-100">
          <button @click="emit('logout')" class="w-full flex items-center gap-3 p-3 text-gray-500 hover:text-slate-700 hover:bg-slate-50 rounded-[14px] transition-all">
            <LogOut class="w-5 h-5" />
            <span>Terminar Sessao</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
