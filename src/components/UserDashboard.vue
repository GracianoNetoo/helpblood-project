<script setup>
import { ref, defineEmits, markRaw, onMounted, watch, computed } from 'vue';
import { LayoutDashboard, Droplet, CalendarDays, LogOut, Bell, AlertCircle, Menu, Megaphone } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useHelpRequestsStore } from '../stores/helpRequestsStore';
import { useDonorsStore } from '../stores/donorsStore';
import { useAuthStore } from '../stores/authStore';

import DashboardOverview from './DashboardOverview.vue';
import MyDonations from './MyDonations.vue';
import Appointments from './Appointments.vue';
import EmergencyRequests from './EmergencyRequests.vue';
import CampaignsDashboard from './CampaignsDashboard.vue';

const emit = defineEmits(['logout']);
const route = useRoute();
const helpRequestsStore = useHelpRequestsStore();
const { requests } = storeToRefs(helpRequestsStore);
const donorsStore = useDonorsStore();
const authStore = useAuthStore();
const { donors } = storeToRefs(donorsStore);
const { currentDonorId } = storeToRefs(authStore);

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, component: markRaw(DashboardOverview) },
  { id: 'donations', name: 'Minhas Doações', icon: Droplet, component: markRaw(MyDonations) },
  { id: 'campaigns', name: 'Campanhas', icon: Megaphone, component: markRaw(CampaignsDashboard) },
  { id: 'appointments', name: 'Agendamentos', icon: CalendarDays, component: markRaw(Appointments) },
  { id: 'emergencies', name: 'Pedidos de Ajuda', icon: AlertCircle, component: markRaw(EmergencyRequests) },
];

const activeTab = ref('dashboard');
const isMobileNavOpen = ref(false);
const autoOpenCampaigns = ref(false);
const approvedRequestsCount = computed(() => requests.value.filter((item) => item.status === 'approved').length);
const currentDonorIdValue = computed(() => Number(currentDonorId.value));
const fallbackDonor = computed(() => donors.value[0] || null);
const currentDonor = computed(() => donors.value.find((donor) => donor.id === currentDonorIdValue.value) || fallbackDonor.value);
const donorName = computed(() => currentDonor.value?.nome || 'Doador');
const donorBlood = computed(() => currentDonor.value?.tipo_sanguineo || 'N/A');
const donorTotalLiters = computed(() => {
  const value = currentDonor.value?.totalDonationLiters;
  if (value === null || typeof value === 'undefined') return 0;
  return Number(value) || 0;
});
const donorTotalLabel = computed(() => donorTotalLiters.value.toFixed(2));
const donorInitials = computed(() => {
  const name = donorName.value.trim();
  if (!name) return 'DV';
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
  const initials = `${first}${last}`.toUpperCase();
  return initials || 'DV';
});

const syncTabFromRoute = (tab) => {
  if (!tab) return;
  const exists = navItems.some((item) => item.id === tab);
  if (exists) activeTab.value = tab;
};

onMounted(() => {
  syncTabFromRoute(route.query.tab);
});

watch(
  () => route.query.tab,
  (tab) => {
    syncTabFromRoute(tab);
  }
);

const handleSelectTab = (tabId, options = {}) => {
  activeTab.value = tabId;
  if (options.autoOpenCampaign) {
    autoOpenCampaigns.value = true;
  }
  isMobileNavOpen.value = false;
};
</script>

<template>
  <div class="h-screen bg-[#FDFDFD] flex overflow-hidden font-sans selection:bg-rose-100 selection:text-rose-900">
    
    <!-- Sidebar -->
    <aside class="w-20 lg:w-64 bg-white/70 backdrop-blur-3xl border-r border-[#E5E7EB]/60 hidden md:flex flex-col shrink-0 transition-all duration-300 relative z-20">
      <div class="p-6 flex items-center justify-center lg:justify-start gap-4 h-24 border-b border-gray-100/50">
        <div class="flex items-center gap-2.5">
          <Droplet class="w-5.5 h-5.5 text-rose-600 fill-rose-600/20" stroke-width="2.5" />
          <span class="text-[20px] font-black text-gray-900 tracking-tight">UniVida</span>
        </div>
      </div>
      
      <div class="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden lg:block px-3 mb-4">Principal</span>
        <button 
          v-for="item in navItems" 
          :key="item.id"
          @click="activeTab = item.id"
          class="w-full flex items-center lg:justify-start justify-center gap-3.5 p-3 rounded-2xl transition-all duration-200 group relative outline-none"
          :class="(activeTab === item.id ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 text-rose-600 font-semibold' : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900 font-medium') + (item.id === 'emergencies' && approvedRequestsCount > 0 ? ' ring-1 ring-rose-200' : '')"
        >
          <div v-if="activeTab === item.id" class="absolute -left-4 w-1 h-6 rounded-r-full bg-rose-500 hidden lg:block"></div>
          <div class="relative">
            <component :is="item.icon" class="w-5.5 h-5.5 transition-transform group-hover:scale-110" :class="activeTab === item.id ? 'text-rose-600' : 'text-gray-400 group-hover:text-gray-500'" stroke-width="2" />
            <span v-if="item.id === 'emergencies' && approvedRequestsCount > 0" class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </div>
          <span class="hidden lg:block">{{ item.name }}</span>
          <span v-if="item.id === 'emergencies' && approvedRequestsCount > 0" class="hidden lg:inline-flex ml-auto text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
            {{ approvedRequestsCount }}
          </span>
        </button>
      </div>
      
      <div class="p-6 border-t border-gray-100/50">
        <button @click="emit('logout')" class="w-full flex items-center lg:justify-start justify-center gap-3.5 p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[14px] transition-all group font-medium">
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
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Visão Geral</h1>
          <p class="text-[13px] md:text-sm text-gray-500 mt-0.5 hidden sm:block">Acompanhe seu impacto diário na comunidade.</p>
        </div>
        
        <div class="flex items-center gap-4 md:gap-6">
          <button @click="isMobileNavOpen = true" class="md:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Menu class="w-5 h-5" />
          </button>
          
          <div class="h-8 w-px bg-gray-200 hidden md:block"></div>
          
          <div class="flex items-center gap-3 group cursor-pointer hover:bg-white p-1.5 md:p-2 rounded-full md:rounded-[20px] pr-2 md:pr-4 transition-all border border-transparent hover:border-gray-200/60 hover:shadow-sm">
            <div class="w-10 h-10 bg-linear-to-br from-rose-100 to-orange-50 rounded-full border border-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-center">
              <span class="text-rose-600 font-bold text-sm">{{ donorInitials }}</span>
            </div>
            <div class="hidden md:block">
              <p class="text-[13px] font-bold text-gray-900 leading-none">{{ donorName }}</p>
              <p class="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-flex mt-1 uppercase tracking-wider">Doador {{ donorBlood }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Scrollable Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth custom-scrollbar">
        <!-- Render Active View Component -->
        <component
          :is="navItems.find(item => item.id === activeTab).component"
          :auto-open="activeTab === 'campaigns' ? autoOpenCampaigns : false"
          @open-campaigns="handleSelectTab('campaigns', $event || {})"
          @open-requests="handleSelectTab('emergencies')"
          @reset-auto-open="autoOpenCampaigns = false"
        />
      </div>
    </main>

    <!-- Mobile Navigation Drawer -->
    <div v-if="isMobileNavOpen" class="fixed inset-0 z-30 md:hidden">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="isMobileNavOpen = false"></div>
      <div class="absolute right-0 top-0 h-full w-72 bg-white shadow-xl border-l border-gray-100 flex flex-col">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Droplet class="w-5.5 h-5.5 text-rose-600 fill-rose-600/20" stroke-width="2.5" />
          <span class="text-[20px] font-black text-gray-900 tracking-tight">UniVida</span>
          </div>
          <button @click="isMobileNavOpen = false" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <LogOut class="w-4 h-4 rotate-180" />
          </button>
        </div>
        <div class="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="handleSelectTab(item.id)"
            class="w-full flex items-center gap-3 p-3 rounded-[14px] transition-all text-left"
            :class="(activeTab === item.id ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-gray-600 hover:bg-gray-50') + (item.id === 'emergencies' && approvedRequestsCount > 0 ? ' ring-1 ring-rose-200' : '')"
          >
            <div class="relative">
              <component :is="item.icon" class="w-5 h-5" />
              <span v-if="item.id === 'emergencies' && approvedRequestsCount > 0" class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </div>
            <span>{{ item.name }}</span>
            <span v-if="item.id === 'emergencies' && approvedRequestsCount > 0" class="ml-auto text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
              {{ approvedRequestsCount }}
            </span>
          </button>
        </div>
        <div class="p-4 border-t border-gray-100">
          <button @click="emit('logout')" class="w-full flex items-center gap-3 p-3 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-[14px] transition-all">
            <LogOut class="w-5 h-5" />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom Scrollbar */
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


