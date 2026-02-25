<script setup>
import { ref, defineEmits, markRaw } from 'vue';
import { LayoutDashboard, Droplet, CalendarDays, LogOut, Bell, FileText, AlertCircle } from 'lucide-vue-next';

import DashboardOverview from './DashboardOverview.vue';
import MyDonations from './MyDonations.vue';
import Appointments from './Appointments.vue';
import EmergencyRequests from './EmergencyRequests.vue';

const emit = defineEmits(['logout']);

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, component: markRaw(DashboardOverview) },
  { id: 'donations', name: 'Minhas Doações', icon: Droplet, component: markRaw(MyDonations) },
  { id: 'appointments', name: 'Agendamentos', icon: CalendarDays, component: markRaw(Appointments) },
  { id: 'emergencies', name: 'Pedidos de Ajuda', icon: AlertCircle, component: markRaw(EmergencyRequests) },
];

const activeTab = ref('dashboard');
</script>

<template>
  <div class="h-screen bg-[#FDFDFD] flex overflow-hidden font-sans selection:bg-rose-100 selection:text-rose-900">
    
    <!-- Sidebar -->
    <aside class="w-20 lg:w-64 bg-white/70 backdrop-blur-3xl border-r border-[#E5E7EB]/60 hidden md:flex flex-col shrink-0 transition-all duration-300 relative z-20">
      <div class="p-6 flex items-center justify-center lg:justify-start gap-4 h-24 border-b border-gray-100/50">
        <div class="w-10 h-10 rounded-[14px] bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20 border border-rose-400">
          <Droplet class="w-5 h-5 text-white" stroke-width="2.5" />
        </div>
        <span class="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 hidden lg:block tracking-tight">UniVida</span>
      </div>
      
      <div class="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden lg:block px-3 mb-4">Principal</span>
        <button 
          v-for="item in navItems" 
          :key="item.id"
          @click="activeTab = item.id"
          class="w-full flex items-center lg:justify-start justify-center gap-3.5 p-3 rounded-[16px] transition-all duration-200 group relative outline-none"
          :class="activeTab === item.id ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 text-rose-600 font-semibold' : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900 font-medium'"
        >
          <div v-if="activeTab === item.id" class="absolute -left-4 w-1 h-6 rounded-r-full bg-rose-500 hidden lg:block"></div>
          <component :is="item.icon" class="w-[22px] h-[22px] transition-transform group-hover:scale-110" :class="activeTab === item.id ? 'text-rose-600' : 'text-gray-400 group-hover:text-gray-500'" stroke-width="2" />
          <span class="hidden lg:block">{{ item.name }}</span>
        </button>
      </div>
      
      <div class="p-6 border-t border-gray-100/50">
        <button @click="emit('logout')" class="w-full flex items-center lg:justify-start justify-center gap-3.5 p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[14px] transition-all group font-medium">
            <LogOut class="w-[22px] h-[22px] transition-transform group-hover:-translate-x-1" stroke-width="2" />
            <span class="hidden lg:block">Terminar Sessão</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden ring-1 ring-gray-200/50">
      
      <!-- Topbar -->
      <header class="h-24 px-6 md:px-10 flex justify-between items-center bg-white/40 backdrop-blur-2xl border-b border-gray-200/50 sticky top-0 z-10 w-full">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Visão Geral</h1>
          <p class="text-[13px] md:text-sm text-gray-500 mt-0.5">Acompanhe seu impacto diário na comunidade.</p>
        </div>
        
        <div class="flex items-center gap-4 md:gap-6">
          <button class="relative p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors hidden md:flex">
            <Bell class="w-[22px] h-[22px]" stroke-width="2" />
            <span class="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 ring-2 ring-white rounded-full"></span>
          </button>
          
          <div class="h-8 w-px bg-gray-200 hidden md:block"></div>
          
          <div class="flex items-center gap-3 group cursor-pointer hover:bg-white p-1.5 md:p-2 rounded-full md:rounded-[20px] pr-2 md:pr-4 transition-all border border-transparent hover:border-gray-200/60 hover:shadow-sm">
            <div class="w-10 h-10 bg-linear-to-br from-rose-100 to-orange-50 rounded-full border border-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-center">
              <span class="text-rose-600 font-bold text-sm">MN</span>
            </div>
            <div class="hidden md:block">
              <p class="text-[13px] font-bold text-gray-900 leading-none">Manuel F.</p>
              <p class="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-flex mt-1 uppercase tracking-wider">Doador O+</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Scrollable Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth custom-scrollbar">
        <!-- Render Active View Component -->
        <component :is="navItems.find(item => item.id === activeTab).component" />
      </div>
    </main>
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