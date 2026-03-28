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
  Megaphone,
  ClipboardList,
  Search,
  Mail,
  Phone,
  MapPin,
  Droplets,
  Activity,
  Sparkles
} from 'lucide-vue-next';
import { useAppointmentsStore } from '../stores/appointmentsStore';
import { useHelpRequestsStore } from '../stores/helpRequestsStore';
import { useDonorsStore } from '../stores/donorsStore';
import { useCampaignsStore } from '../stores/campaignsStore';

const emit = defineEmits(['logout']);

const navItems = [
  { id: 'overview', name: 'Visao Geral', icon: LayoutDashboard },
  { id: 'requests', name: 'Pedidos de Ajuda', icon: AlertTriangle },
  { id: 'campaigns', name: 'Campanhas', icon: Megaphone },
  { id: 'donors', name: 'Doadores', icon: UserRound },
  { id: 'appointments', name: 'Agendamentos', icon: CalendarDays }
];

const activeTab = ref('overview');
const isMobileNavOpen = ref(false);

const appointmentsStore = useAppointmentsStore();
const helpRequestsStore = useHelpRequestsStore();
const donorsStore = useDonorsStore();
const campaignsStore = useCampaignsStore();

const { appointments } = storeToRefs(appointmentsStore);
const { requests, lastSyncError: helpRequestsSyncError } = storeToRefs(helpRequestsStore);
const { donors } = storeToRefs(donorsStore);
const { campaigns, lastSyncError: campaignsSyncError } = storeToRefs(campaignsStore);

const totalAppointments = computed(() => appointments.value.length);
const totalRequests = computed(() => requests.value.length);
const pendingRequests = computed(() => requests.value.filter((item) => !item.status || item.status === 'pending'));
const approvedRequests = computed(() => requests.value.filter((item) => item.status === 'approved'));
const rejectedRequests = computed(() => requests.value.filter((item) => item.status === 'rejected'));
const pendingRequestsCount = computed(() => pendingRequests.value.length);
const totalDonors = computed(() => donors.value.length);
const activeDonors = computed(() => donors.value.filter((donor) => donor.status === 'ativo').length);
const suspendedDonorsCount = computed(() => donors.value.filter((donor) => donor.status !== 'ativo').length);
const donorsWithHistoryCount = computed(() => donors.value.filter((donor) => {
  const history = Array.isArray(donor.donationHistory) ? donor.donationHistory : [];
  return history.length > 0 || (donor.lastDonationLiters !== null && typeof donor.lastDonationLiters !== 'undefined');
}).length);
const totalDonatedAcrossDonors = computed(() => donors.value.reduce((sum, donor) => {
  return sum + (Number(donor.totalDonationLiters) || 0);
}, 0));
const totalCampaigns = computed(() => campaigns.value.length);
const activeCampaigns = computed(() => campaigns.value.filter((camp) => camp.status !== 'inativo').length);
const activeCampaignOptions = computed(() => campaigns.value.filter((camp) => camp.status !== 'inativo'));
const donorSearch = ref('');
const donorStatusFilter = ref('todos');

const scheduledAppointments = computed(() => appointments.value.filter((apt) => apt.campaignId));
const latestAppointments = computed(() => scheduledAppointments.value.slice(0, 4));
const latestRequests = computed(() => pendingRequests.value.slice(0, 4));
const latestDonors = computed(() => donors.value.slice(0, 4));
const latestCampaigns = computed(() => campaigns.value.slice(0, 4));
const donorNameById = (donorId) => {
  const donor = donors.value.find((item) => String(item.id) === String(donorId));
  return donor?.nome || 'Doador nao identificado';
};

const getDefaultCampaignIdForDonor = (donorId) => {
  const donorAppointment = scheduledAppointments.value.find((appointment) => {
    return String(appointment.donorId) === String(donorId)
      && activeCampaignOptions.value.some((campaign) => campaign.id === appointment.campaignId);
  });
  if (donorAppointment?.campaignId) return donorAppointment.campaignId;
  return activeCampaignOptions.value.length ? activeCampaignOptions.value[0].id : '';
};

const removeRequest = (id) => {
  helpRequestsStore.removeRequest(id);
};

const approveRequest = (id) => {
  helpRequestsStore.approveRequest(id);
};

const rejectRequest = (id) => {
  helpRequestsStore.rejectRequest(id);
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

const donationDrafts = ref({});
const donationTouched = ref({});
const formatLiters = (value) => (value === null || typeof value === 'undefined' ? '' : String(value));
const donationMin = 0.1;
const donationMax = 1.0;
const donationStep = 0.05;

const parseDonationValue = (value) => {
  if (value === null || typeof value === 'undefined') return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const normalized = raw.replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
};

const getDonationError = (value) => {
  const parsed = parseDonationValue(value);
  if (parsed === null) return 'Informe um valor em litros.';
  if (parsed < donationMin || parsed > donationMax) {
    return `Use entre ${donationMin} e ${donationMax} L.`;
  }
  return '';
};

const syncDonationDraft = (donorId) => {
  const donor = donors.value.find((item) => item.id === donorId);
  if (!donor) return;
  donationDrafts.value[donorId] = formatLiters(donor.lastDonationLiters);
};

const ensureDonationDraft = (donorId) => {
  if (typeof donationDrafts.value[donorId] !== 'undefined') return;
  syncDonationDraft(donorId);
};

const saveDonationLiters = (donorId, liters, campaign) => {
  const draftValue = typeof liters === 'undefined' ? donationDrafts.value[donorId] ?? '' : liters;
  const error = getDonationError(draftValue);
  if (error) return;
  donorsStore.updateLastDonationLiters(donorId, draftValue, campaign);
  syncDonationDraft(donorId);
};

const applyDonationPreset = (donorId, value) => {
  donationDrafts.value[donorId] = String(value);
  donationTouched.value[donorId] = true;
};

const getDonationDraftValue = (donorId, fallback) => {
  const draft = donationDrafts.value[donorId];
  return typeof draft === 'undefined' ? fallback : draft;
};

const getDonationErrorFor = (donorId, fallback) => {
  const value = getDonationDraftValue(donorId, fallback);
  if (!donationTouched.value[donorId]) return '';
  return getDonationError(value);
};

const canSaveDonation = (donorId, fallback) => {
  const value = getDonationDraftValue(donorId, fallback);
  return !getDonationError(value);
};

const isDonationModalOpen = ref(false);
const donationModal = ref({
  donorId: null,
  liters: '',
  campaignId: ''
});
const donationModalError = ref('');

const openDonationModal = (donorId) => {
  donationTouched.value[donorId] = true;
  ensureDonationDraft(donorId);
  const donor = donors.value.find((item) => item.id === donorId);
  const fallbackValue = donor ? formatLiters(donor.lastDonationLiters) : '';
  const draftValue = getDonationDraftValue(donorId, fallbackValue);
  const error = getDonationError(draftValue);
  if (error) return;
  const availableCampaigns = activeCampaignOptions.value;
  donationModal.value = {
    donorId,
    liters: draftValue,
    campaignId: availableCampaigns.length ? getDefaultCampaignIdForDonor(donorId) : ''
  };
  donationModalError.value = '';
  isDonationModalOpen.value = true;
};

const closeDonationModal = () => {
  isDonationModalOpen.value = false;
  donationModalError.value = '';
};

const selectedDonationCampaign = computed(() => {
  if (!donationModal.value.campaignId) return null;
  return activeCampaignOptions.value.find((camp) => camp.id === donationModal.value.campaignId) || null;
});

const selectedDonationDonor = computed(() => {
  if (!donationModal.value.donorId) return null;
  return donors.value.find((item) => item.id === donationModal.value.donorId) || null;
});

const confirmDonationModal = () => {
  const { donorId, liters, campaignId } = donationModal.value;
  if (!donorId) return;
  if (!campaignId) {
    donationModalError.value = 'Selecione uma campanha ativa.';
    return;
  }
  const campaign = activeCampaignOptions.value.find((camp) => camp.id === campaignId);
  if (!campaign) {
    donationModalError.value = 'Campanha invalida ou inativa.';
    return;
  }
  saveDonationLiters(donorId, liters, campaign);
  appointmentsStore.completeCampaignForDonor(donorId, campaignId);
  closeDonationModal();
};

const formatDonationDate = (value) => {
  if (!value) return 'Sem data';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsed);
};

const getDonorInitials = (name) => {
  const normalizedName = String(name || '').trim();
  if (!normalizedName) return 'DV';
  const parts = normalizedName.split(' ').filter(Boolean);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
  return `${first}${last}`.toUpperCase() || 'DV';
};

const getDonorStatusLabel = (status) => (status === 'ativo' ? 'Ativo' : 'Em repouso');

const getDonorStatusClasses = (status) => (
  status === 'ativo'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
    : 'bg-amber-50 text-amber-700 border-amber-100'
);

const formatTotalDonated = (value) => Number(value || 0).toFixed(2);

const filteredDonors = computed(() => {
  const searchTerm = donorSearch.value.trim().toLowerCase();
  return donors.value.filter((donor) => {
    const matchesStatus = donorStatusFilter.value === 'todos' || donor.status === donorStatusFilter.value;
    if (!matchesStatus) return false;
    if (!searchTerm) return true;
    const haystack = [
      donor.nome,
      donor.tipo_sanguineo,
      donor.rh,
      donor.provincia,
      donor.municipio,
      donor.telefone,
      donor.email
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(searchTerm);
  });
});

const removeCampaign = (id) => {
  campaignsStore.removeCampaign(id);
};

const setTab = (tab) => {
  activeTab.value = tab;
  isMobileNavOpen.value = false;
};

const newCampaign = ref({
  title: '',
  location: '',
  dateISO: '',
  time: '',
  description: '',
  tags: '',
  highlight: 'Aberto'
});
const campaignSubmitted = ref(false);
const campaignTouched = ref({
  title: false,
  location: false,
  dateISO: false,
  time: false
});
const todayISO = new Date().toISOString().split('T')[0];
const isDateInPast = computed(() => {
  if (!newCampaign.value.dateISO) return false;
  return newCampaign.value.dateISO < todayISO;
});

const isCampaignInvalid = computed(() => {
  if (!newCampaign.value.title) return true;
  if (!newCampaign.value.location) return true;
  if (!newCampaign.value.dateISO) return true;
  if (isDateInPast.value) return true;
  if (!newCampaign.value.time) return true;
  return false;
});

const shouldShowCampaignError = (field) => campaignSubmitted.value || campaignTouched.value[field];

const resetCampaignForm = () => {
  newCampaign.value = {
    title: '',
    location: '',
    dateISO: '',
    time: '',
    description: '',
    tags: '',
    highlight: 'Aberto'
  };
  campaignSubmitted.value = false;
  campaignTouched.value = {
    title: false,
    location: false,
    dateISO: false,
    time: false
  };
};

const addCampaign = async () => {
  campaignSubmitted.value = true;
  if (isCampaignInvalid.value) return;
  const tagsArray = newCampaign.value.tags
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  await campaignsStore.addCampaign({
    title: newCampaign.value.title,
    location: newCampaign.value.location,
    dateISO: newCampaign.value.dateISO,
    time: newCampaign.value.time,
    description: newCampaign.value.description,
    tags: tagsArray.length ? tagsArray : ['Todos'],
    highlight: newCampaign.value.highlight
  });
  resetCampaignForm();
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
          <span class="hidden lg:block">Terminar Sessão</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden ring-1 ring-gray-200/50">
      <!-- Topbar -->
      <header class="h-20 md:h-24 px-4 md:px-10 flex justify-between items-center bg-white/40 backdrop-blur-2xl border-b border-gray-200/50 sticky top-0 z-20 w-full">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Administração</h1>
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
        <div v-if="helpRequestsSyncError || campaignsSyncError" class="max-w-300 mx-auto mb-6 space-y-3">
          <div v-if="helpRequestsSyncError" class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Nao foi possivel sincronizar os pedidos de ajuda agora. {{ helpRequestsSyncError }}
          </div>
          <div v-if="campaignsSyncError" class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Nao foi possivel sincronizar as campanhas agora. {{ campaignsSyncError }}
          </div>
        </div>

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
                <button @click="setTab('requests')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todos</button>
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
                  <button @click="approveRequest(request.id)" class="text-[12px] font-semibold text-emerald-600 hover:text-emerald-700">Aprovar</button>
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
                <button @click="setTab('campaigns')" class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver todas</button>
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
                    <button @click="removeCampaign(camp.id)" class="text-[12px] font-semibold text-rose-600 hover:text-rose-700">
                      Remover
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
                <p class="text-sm text-gray-500 mt-1">Aprovar antes de aparecer para os doadores.</p>
              </div>
              <div class="text-[12px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">Total: {{ totalRequests }}</div>
            </div>

            <div v-if="requests.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
              Sem pedidos registados.
            </div>

            <div v-else class="space-y-6">
              <div>
                <h3 class="text-sm font-bold text-gray-900 mb-4">Pendentes</h3>
                <div v-if="pendingRequests.length === 0" class="py-8 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
                  Sem pedidos pendentes.
                </div>
                <div v-else class="space-y-4">
                  <div v-for="request in pendingRequests" :key="request.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ request.tipo_sanguineo || 'N/A' }} • Urgencia: {{ request.urgencia || 'Normal' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">Contacto: {{ request.contacto || 'Nao informado' }}</div>
                        <div class="text-[12px] text-gray-400 mt-2">{{ request.motivo || 'Motivo nao informado.' }}</div>
                      </div>
                      <div class="flex flex-col gap-2">
                        <button @click="approveRequest(request.id)" class="self-start px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors">Aprovar</button>
                        <button @click="rejectRequest(request.id)" class="self-start px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors">Rejeitar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-bold text-gray-900 mb-4">Aprovados</h3>
                <div v-if="approvedRequests.length === 0" class="py-8 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
                  Sem pedidos aprovados.
                </div>
                <div v-else class="space-y-4">
                  <div v-for="request in approvedRequests" :key="request.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ request.tipo_sanguineo || 'N/A' }} • Urgencia: {{ request.urgencia || 'Normal' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">Contacto: {{ request.contacto || 'Nao informado' }}</div>
                      </div>
                      <button @click="removeRequest(request.id)" class="self-start px-4 py-2 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Remover</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="rejectedRequests.length > 0">
                <h3 class="text-sm font-bold text-gray-900 mb-4">Rejeitados</h3>
                <div class="space-y-4">
                  <div v-for="request in rejectedRequests" :key="request.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <div class="text-sm font-bold text-gray-900">{{ request.nome || 'Anonimo' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">{{ request.localizacao || 'Localizacao nao informada' }}</div>
                        <div class="text-[12px] text-gray-500 mt-1">Sangue: {{ request.tipo_sanguineo || 'N/A' }} • Urgencia: {{ request.urgencia || 'Normal' }}</div>
                      </div>
                      <button @click="removeRequest(request.id)" class="self-start px-4 py-2 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Excluir</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Campaigns Tab -->
        <section v-else-if="activeTab === 'campaigns'" class="max-w-300 mx-auto pb-10">
          <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Campanhas</h2>
                <p class="text-sm text-gray-500 mt-1">Crie campanhas para os utilizadores.</p>
              </div>
              <div class="text-[12px] font-bold text-sky-600 bg-sky-50 border border-sky-100 px-4 py-2 rounded-full">Total: {{ totalCampaigns }}</div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div class="space-y-4">
                <div>
                  <label class="text-[12px] font-bold text-gray-600">Titulo</label>
                  <input
                    v-model="newCampaign.title"
                    @blur="campaignTouched.title = true"
                    type="text"
                    placeholder="Ex: Campanha Central"
                    class="mt-2 w-full bg-gray-50 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium"
                    :class="shouldShowCampaignError('title') && !newCampaign.title ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'"
                  />
                  <p v-if="shouldShowCampaignError('title') && !newCampaign.title" class="text-[11px] text-rose-600 font-bold mt-1">Titulo e obrigatorio.</p>
                </div>
                <div>
                  <label class="text-[12px] font-bold text-gray-600">Localizacao</label>
                  <input
                    v-model="newCampaign.location"
                    @blur="campaignTouched.location = true"
                    type="text"
                    placeholder="Ex: Luanda"
                    class="mt-2 w-full bg-gray-50 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium"
                    :class="shouldShowCampaignError('location') && !newCampaign.location ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'"
                  />
                  <p v-if="shouldShowCampaignError('location') && !newCampaign.location" class="text-[11px] text-rose-600 font-bold mt-1">Localizacao e obrigatoria.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-[12px] font-bold text-gray-600">Data</label>
                    <input
                      v-model="newCampaign.dateISO"
                      @blur="campaignTouched.dateISO = true"
                      type="date"
                      :min="todayISO"
                      class="mt-2 w-full bg-gray-200 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium"
                      :class="(shouldShowCampaignError('dateISO') && !newCampaign.dateISO) || isDateInPast ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'"
                    />
                    <p v-if="shouldShowCampaignError('dateISO') && !newCampaign.dateISO" class="text-[11px] text-rose-600 font-bold mt-1">Data e obrigatoria.</p>
                    <p v-else-if="isDateInPast" class="text-[11px] text-rose-600 font-bold mt-1">Escolha uma data a partir de hoje.</p>
                  </div>
                  <div>
                    <label class="text-[12px] font-bold text-gray-600">Hora</label>
                    <input
                      v-model="newCampaign.time"
                      @blur="campaignTouched.time = true"
                      type="time"
                      step="900"
                      class="mt-2 w-full bg-gray-200 border text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all font-medium"
                      :class="shouldShowCampaignError('time') && !newCampaign.time ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 focus:ring-sky-500/20 focus:border-sky-500'"
                    />
                    <p v-if="shouldShowCampaignError('time') && !newCampaign.time" class="text-[11px] text-rose-600 font-bold mt-1">Hora e obrigatoria.</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="text-[12px] font-bold text-gray-600">Descricao</label>
                  <textarea v-model="newCampaign.description" rows="5" placeholder="Descreva a campanha."
                    class="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium resize-none"></textarea>
                </div>
                <div>
                  <label class="text-[12px] font-bold text-gray-600">Tags (separadas por virgula)</label>
                  <input v-model="newCampaign.tags" type="text" placeholder="Ex: O+, O-"
                    class="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium" />
                </div>
                <div>
                  <label class="text-[12px] font-bold text-gray-600">Destaque</label>
                  <select v-model="newCampaign.highlight"
                    class="mt-2 w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium">
                    <option>Aberto</option>
                    <option>Critico</option>
                  </select>
                </div>
                <button
                  @click="addCampaign"
                  :disabled="isCampaignInvalid"
                  class="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-2xl px-6 py-3.5 font-extrabold text-[14px] shadow-[0_8px_20px_rgba(14,165,233,0.2)] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-sky-600"
                >
                  Criar campanha
                </button>
                <button @click="resetCampaignForm" class="w-full mt-2 bg-white text-gray-700 border border-gray-200 rounded-2xl px-6 py-3 font-semibold text-[13px] hover:bg-gray-50 transition-all">
                  Limpar campos
                </button>
              </div>
            </div>

            <div v-if="campaigns.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
              Sem campanhas registadas.
            </div>

            <div v-else class="space-y-4">
              <div v-for="camp in campaigns" :key="camp.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ camp.title || 'Campanha' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">Local: {{ camp.location || 'Local' }} • Data: {{ camp.dateISO || 'Data' }} • {{ camp.time || 'Horario' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">Tags: {{ (camp.tags || []).join(', ') }}</div>
                    <div class="text-[12px] text-gray-400 mt-2">Status: {{ camp.status || 'ativo' }}</div>
                  </div>
                    <div class="flex flex-col gap-2">
                      <button @click="removeCampaign(camp.id)" class="px-4 py-2 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors">
                        Remover
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Donors Tab -->
        <section v-else-if="activeTab === 'donors'" class="max-w-300 mx-auto pb-10">
          <div class="space-y-6">
            <div class="relative overflow-hidden rounded-4xl border border-rose-100/70 bg-linear-to-br from-[#2a0f0f] via-[#971818] to-[#4b3232] p-6 md:p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
              <div class="absolute -top-18 right-0 h-48 w-48 rounded-full bg-rose-400/12 blur-3xl"></div>
              <div class="absolute -bottom-18 left-0 h-44 w-44 rounded-full bg-rose-400/10 blur-3xl"></div>
              <div class="relative flex flex-col gap-6">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div class="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-100">
                      <Sparkles class="w-3.5 h-3.5" />
                      Centro de doadores
                    </div>
                    <h2 class="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight">Gestão visual da base de doadores</h2>
                    <p class="mt-2 max-w-2xl text-sm md:text-[15px] text-slate-300">
                      Organize a operação com melhor leitura de status, historico de doação e contactos essenciais numa única area.
                    </p>
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
                  <span class="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-[12px] font-bold text-emerald-700">
                    Base ativa
                  </span>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
                <label class="relative block">
                  <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    v-model="donorSearch"
                    type="text"
                    placeholder="Pesquisar por nome, sangue, localizacao, telefone ou email"
                    class="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3.5 text-[14px] text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 transition-all"
                  />
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="donorStatusFilter = 'todos'"
                    class="px-4 py-3 rounded-2xl text-[12px] font-bold border transition-all"
                    :class="donorStatusFilter === 'todos' ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
                  >
                    Todos
                  </button>
                  <button
                    @click="donorStatusFilter = 'ativo'"
                    class="px-4 py-3 rounded-2xl text-[12px] font-bold border transition-all"
                    :class="donorStatusFilter === 'ativo' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/15' : 'bg-white text-emerald-700 border-emerald-100 hover:bg-emerald-50'"
                  >
                    Ativos
                  </button>
                  <button
                    @click="donorStatusFilter = 'suspenso'"
                    class="px-4 py-3 rounded-2xl text-[12px] font-bold border transition-all"
                    :class="donorStatusFilter === 'suspenso' ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/15' : 'bg-white text-amber-700 border-amber-100 hover:bg-amber-50'"
                  >
                    Em repouso
                  </button>
                </div>
              </div>

              <div v-if="donors.length === 0" class="mt-6 py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
                Sem doadores registados.
              </div>

              <div v-else-if="filteredDonors.length === 0" class="mt-6 py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
                Nenhum doador encontrado com os filtros atuais.
              </div>

              <div v-else class="mt-6 space-y-4">
                <div
                  v-for="donor in filteredDonors"
                  :key="donor.id"
                  class="group relative overflow-hidden rounded-[30px] border border-gray-200/80 bg-linear-to-br from-white to-gray-50/60 p-5 md:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)]"
                >
                  <div class="relative flex flex-col xl:flex-row gap-5 xl:gap-6">
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div class="flex items-start gap-4">
                          <div class="w-14 h-14 rounded-3xl bg-linear-to-br from-rose-500 via-rose-600 to-red-700 text-white flex items-center justify-center font-black text-lg shadow-[0_12px_24px_rgba(222,18,22,0.20)]">
                            {{ getDonorInitials(donor.nome) }}
                          </div>
                          <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2">
                              <h3 class="text-lg font-extrabold text-gray-900 truncate">{{ donor.nome || 'Doador' }}</h3>
                              <span class="inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
                                {{ donor.tipo_sanguineo || 'N/A' }}
                              </span>
                              <span class="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold" :class="getDonorStatusClasses(donor.status)">
                                {{ getDonorStatusLabel(donor.status) }}
                              </span>
                            </div>
                            <p class="mt-1 text-[13px] text-gray-500">
                              {{ donor.doacao_sangue || 'Historico de doação não informado' }}
                            </p>
                          </div>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div class="rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 min-w-28">
                            <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Total</div>
                            <div class="mt-1 text-lg font-extrabold text-gray-900">{{ formatTotalDonated(donor.totalDonationLiters) }} <span class="text-[11px] font-bold text-gray-400">L</span></div>
                          </div>
                          <div class="rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 min-w-28">
                            <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Última</div>
                            <div class="mt-1 text-sm font-extrabold text-gray-900">
                              {{ donor.lastDonationLiters !== null && typeof donor.lastDonationLiters !== 'undefined' ? `${donor.lastDonationLiters} L` : 'Sem registo' }}
                            </div>
                          </div>
                          <div class="rounded-2xl border border-gray-100 bg-white/90 px-4 py-3 min-w-28 col-span-2 sm:col-span-1">
                            <div class="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Data</div>
                            <div class="mt-1 text-sm font-extrabold text-gray-900">{{ formatDonationDate(donor.lastDonationDate) }}</div>
                          </div>
                        </div>
                      </div>

                      <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div class="rounded-2xl border border-gray-100 bg-white/85 px-4 py-3">
                          <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                            <MapPin class="w-3.5 h-3.5" />
                            Localização
                          </div>
                          <div class="mt-2 text-[13px] font-semibold text-gray-700">
                            {{ donor.provincia || 'Provincia' }} • {{ donor.municipio || 'Municipio' }}
                          </div>
                        </div>

                        <div class="rounded-2xl border border-gray-100 bg-white/85 px-4 py-3">
                          <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                            <Phone class="w-3.5 h-3.5" />
                            Telefone
                          </div>
                          <div class="mt-2 text-[13px] font-semibold text-gray-700">{{ donor.telefone || 'Não informado' }}</div>
                        </div>

                        <div class="rounded-2xl border border-gray-100 bg-white/85 px-4 py-3">
                          <div class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                            <Mail class="w-3.5 h-3.5" />
                            Email
                          </div>
                          <div class="mt-2 text-[13px] font-semibold text-gray-700 break-all">{{ donor.email || 'Sem email' }}</div>
                        </div>
                      </div>

                      <div class="mt-4 rounded-2xl border border-gray-100 bg-white/85 px-4 py-3 text-[12px] text-gray-600">
                        <span v-if="donor.lastDonationCampaignTitle">
                          Última campanha registada: <span class="font-bold text-gray-900">{{ donor.lastDonationCampaignTitle }}</span>
                        </span>
                        <span v-else>
                          Última campanha registada: <span class="font-bold text-gray-900">Não informado</span>
                        </span>
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
                          <input
                            :value="getDonationDraftValue(donor.id, formatLiters(donor.lastDonationLiters))"
                            @focus="ensureDonationDraft(donor.id)"
                            @input="donationDrafts[donor.id] = $event.target.value; donationTouched[donor.id] = true"
                            type="number"
                            :min="donationMin"
                            :max="donationMax"
                            :step="donationStep"
                            placeholder="0.45"
                            class="w-full bg-white border border-rose-100 text-gray-900 text-[13px] rounded-2xl pl-4 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium shadow-sm"
                          />
                          <button
                            type="button"
                            @click="donationDrafts[donor.id] = ''; donationTouched[donor.id] = true"
                            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                            aria-label="Limpar valor"
                          >
                            <span class="text-[11px] font-bold">X</span>
                          </button>
                        </div>

                        <div class="mt-3 flex flex-wrap gap-2">
                          <button @click="applyDonationPreset(donor.id, 0.45)" class="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-colors">0.45 L</button>
                          <button @click="applyDonationPreset(donor.id, 0.5)" class="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-colors">0.50 L</button>
                          <button @click="applyDonationPreset(donor.id, 0.6)" class="px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-emerald-100 text-emerald-700 hover:bg-emerald-50 transition-colors">0.60 L</button>
                        </div>

                        <p v-if="getDonationErrorFor(donor.id, formatLiters(donor.lastDonationLiters))" class="text-[11px] text-rose-600 font-bold mt-3">
                          {{ getDonationErrorFor(donor.id, formatLiters(donor.lastDonationLiters)) }}
                        </p>

                        <button
                          @click="openDonationModal(donor.id)"
                          :disabled="!canSaveDonation(donor.id, formatLiters(donor.lastDonationLiters))"
                          class="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-4 py-3 text-[12px] font-bold transition-all shadow-[0_10px_20px_rgba(16,185,129,0.18)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                        >
                          Guardar doação
                        </button>
                      </div>

                      <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                        <button @click="toggleDonorStatus(donor.id)" class="px-4 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                          {{ donor.status === 'ativo' ? 'Colocar em repouso' : 'Ativar' }}
                        </button>
                        <button @click="removeDonor(donor.id)" class="px-4 py-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 font-semibold hover:bg-rose-100 transition-colors">
                          Remover
                        </button>
                      </div>
                    </div>
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

            <div v-if="scheduledAppointments.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
              Sem campanhas marcados.
            </div>

            <div v-else class="space-y-4">
              <div v-for="apt in scheduledAppointments" :key="apt.id" class="border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-all">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div class="text-sm font-bold text-gray-900">{{ apt.hospital || 'Hospital' }}</div>
                    <div class="text-[12px] text-gray-500 mt-1">{{ donorNameById(apt.donorId) }}</div>
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

    <!-- Donation Campaign Modal -->
    <div v-if="isDonationModalOpen" class="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeDonationModal"></div>
      <div class="relative w-full max-w-lg rounded-4xl bg-white p-6 md:p-8 shadow-2xl border border-gray-200/70">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-xl font-extrabold text-gray-900">Confirmar doacao</h3>
            <p class="text-sm text-gray-500 mt-1">Associe a doacao a uma campanha ativa para confirmar a presenca.</p>
          </div>
          <button @click="closeDonationModal" class="w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors" aria-label="Fechar">
            X
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4">
            <div class="text-[12px] font-bold text-gray-500">Resumo</div>
            <div class="mt-2 text-sm text-gray-900 font-semibold">
              {{ selectedDonationDonor?.nome || 'Doador' }} • {{ donationModal.liters }} L
            </div>
          </div>

          <div>
            <label class="text-[12px] font-bold text-gray-600">Campanha ativa</label>
            <select
              v-model="donationModal.campaignId"
              class="mt-2 w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            >
              <option value="" disabled>Selecione uma campanha</option>
              <option v-for="camp in activeCampaignOptions" :key="camp.id" :value="camp.id">
                {{ camp.title }} • {{ camp.location }} • {{ camp.dateISO }} {{ camp.time }}
              </option>
            </select>
            <p v-if="activeCampaignOptions.length === 0" class="text-[11px] text-rose-600 font-bold mt-2">
              Sem campanhas ativas no momento.
            </p>
          </div>

          <div v-if="selectedDonationCampaign" class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-[12px] text-emerald-900">
            <div class="font-bold">{{ selectedDonationCampaign.title }}</div>
            <div class="mt-1 text-emerald-700">{{ selectedDonationCampaign.location }} • {{ selectedDonationCampaign.dateISO }} • {{ selectedDonationCampaign.time }}</div>
            <div class="mt-2 text-emerald-700">Ao confirmar, o agendamento deste doador para esta campanha sera removido automaticamente.</div>
          </div>

          <p v-if="donationModalError" class="text-[12px] text-rose-600 font-bold">{{ donationModalError }}</p>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <button @click="closeDonationModal" class="w-full sm:w-auto px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
            Cancelar
          </button>
          <button
            @click="confirmDonationModal"
            :disabled="activeCampaignOptions.length === 0"
            class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Confirmar doação
          </button>
        </div>
      </div>
    </div>

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
            <span>Terminar Sessão</span>
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
