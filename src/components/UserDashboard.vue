<script setup>
import { defineEmits } from 'vue';
import { LayoutDashboard, Droplet, CalendarDays, LogOut, Bell, User, MapPin, Navigation, Activity, Clock, FileText } from 'lucide-vue-next';

const emit = defineEmits(['logout']);

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Minhas Doações', icon: Droplet, active: false },
  { name: 'Agendamentos', icon: CalendarDays, active: false },
  { name: 'Resultados', icon: FileText, active: false },
];
</script>

<template>
  <div class="h-screen bg-[#FDFDFD] flex overflow-hidden font-sans selection:bg-rose-100 selection:text-rose-900">
    
    <!-- Sidebar -->
    <aside class="w-20 lg:w-64 bg-white/70 backdrop-blur-3xl border-r border-[#E5E7EB]/60 hidden md:flex flex-col shrink-0 transition-all duration-300 relative z-20">
      <div class="p-6 flex items-center justify-center lg:justify-start gap-4 h-24 border-b border-gray-100/50">
        <div class="w-10 h-10 rounded-[14px] bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20 shadow-inner shadow-white/20 border border-rose-400">
          <Droplet class="w-5 h-5 text-white" stroke-width="2.5" />
        </div>
        <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden lg:block tracking-tight">UniVida</span>
      </div>
      
      <div class="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden lg:block px-3 mb-4">Principal</span>
        <button 
          v-for="item in navItems" 
          :key="item.name"
          class="w-full flex items-center lg:justify-start justify-center gap-3.5 p-3 rounded-[16px] transition-all duration-200 group relative outline-none"
          :class="item.active ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 text-rose-600 font-semibold' : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900 font-medium'"
        >
          <div v-if="item.active" class="absolute -left-4 w-1 h-6 rounded-r-full bg-rose-500 hidden lg:block"></div>
          <component :is="item.icon" class="w-[22px] h-[22px] transition-transform group-hover:scale-110" :class="item.active ? 'text-rose-600' : 'text-gray-400 group-hover:text-gray-500'" stroke-width="2" />
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
            <div class="w-10 h-10 bg-gradient-to-br from-rose-100 to-orange-50 rounded-full border border-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-center">
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
        <div class="max-w-[1200px] mx-auto space-y-6 md:space-y-8 pb-10">
          
          <!-- Welcome Bento Row -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Hero Card -->
            <div class="lg:col-span-8 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-700/50 flex flex-col justify-between group h-full">
              <!-- Glow Effects -->
              <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-rose-500/20 transition-all duration-700 pointer-events-none"></div>
              <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
              
              <div class="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 w-fit shadow-sm">
                    <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span class="text-[11px] font-bold text-emerald-50 uppercase tracking-widest">Apto para doar</span>
                  </div>
                  
                  <h2 class="text-3xl md:text-[42px] font-extrabold tracking-tight mb-4 leading-tight">Você pode salvar <br class="hidden md:block"/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">até 4 vidas</span> hoje.</h2>
                  <p class="text-gray-400 max-w-lg text-[15px] leading-relaxed">Os bancos de sangue estão precisando de doadores do tipo O+. O Seu tipo sanguíneo é essencial neste momento.</p>
                </div>
                
                <div class="mt-10 flex gap-4 items-center">
                  <button class="bg-white text-gray-900 hover:bg-gray-50 px-6 py-3.5 rounded-2xl font-bold shadow-[0_4px_14px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] flex items-center gap-2">
                    <CalendarDays class="w-5 h-5 text-gray-700" />
                    Agendar Doação
                  </button>
                </div>
              </div>
            </div>

            <!-- Stats Mini Bento -->
            <div class="lg:col-span-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 grid-rows-1 lg:grid-rows-2 gap-6 h-full">
              
              <div class="bg-white rounded-[32px] p-6 border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-md transition-all">
                <div class="absolute -right-6 -top-6 w-32 h-32 bg-rose-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-[18px] flex items-center justify-center mb-6 border border-rose-100/50">
                  <Activity class="w-6 h-6" stroke-width="2.5" />
                </div>
                <div>
                  <div class="text-[13px] font-semibold text-gray-500 mb-1.5">Vidas Salvas</div>
                  <div class="text-4xl font-extrabold text-gray-900 flex items-baseline gap-2 tracking-tight">04 <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">+1 este ano</span></div>
                </div>
              </div>

              <div class="bg-white rounded-[32px] p-6 border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-md transition-all">
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-[18px] flex items-center justify-center mb-6 border border-blue-100/50">
                  <Droplet class="w-6 h-6" stroke-width="2.5" />
                </div>
                <div>
                  <div class="text-[13px] font-semibold text-gray-500 mb-1.5">Volume Doado</div>
                  <div class="text-4xl font-extrabold text-gray-900 tracking-tight">1.8 <span class="text-xl text-gray-400 font-semibold">Litros</span></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Second Row -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Digital Card Bento -->
            <div class="lg:col-span-5 bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] rounded-[32px] p-8 md:p-10 border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-center items-center relative overflow-hidden z-0">
              <div class="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
              
              <div class="w-full flex justify-between items-center mb-8 relative z-10 w-full max-w-sm mx-auto">
                <h3 class="text-lg font-bold text-gray-900">Cartão Digital</h3>
                <button class="text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
                  <FileText class="w-4 h-4"/> Baixar
                </button>
              </div>

              <!-- Sleek Card Mockup (21st.dev style) -->
              <div class="relative z-10 w-full max-w-sm aspect-[1.586/1] rounded-[24px] p-6 bg-white/40 backdrop-blur-3xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] flex flex-col justify-between overflow-hidden group">
                <div class="absolute -top-[100px] -left-[100px] w-[250px] h-[250px] bg-white/80 rounded-full blur-[50px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                <div class="absolute -bottom-[100px] -right-[50px] w-[200px] h-[200px] bg-rose-400/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-rose-400/30 transition-all duration-1000"></div>
                
                <div class="flex justify-between items-center relative z-10">
                  <div class="flex gap-2 items-center text-gray-800">
                    <Droplet class="w-5 h-5 text-rose-600 fill-rose-600/20" />
                    <span class="text-[13px] font-black tracking-widest uppercase">UniVida</span>
                  </div>
                  <div>
                    <span class="text-[9px] font-extrabold text-gray-500 uppercase tracking-[0.2em] bg-white/60 px-2.5 py-1.5 rounded-full border border-white shadow-sm mix-blend-multiply">Doador Nacional</span>
                  </div>
                </div>

                <div class="relative z-10 flex justify-between items-end">
                  <div>
                    <p class="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1.5 font-bold">Titular</p>
                    <p class="text-[17px] font-extrabold text-gray-900 tracking-tight mb-1">Manuel Francisco</p>
                    <p class="text-[11px] font-medium text-gray-500 font-mono tracking-widest bg-gray-100/50 px-2 py-0.5 rounded-md inline-block">007241052LA</p>
                  </div>
                  <div class="bg-rose-50/80 backdrop-blur-sm px-4 py-2 rounded-[16px] border border-rose-100 text-center shadow-sm">
                    <p class="text-[9px] uppercase tracking-[0.1em] text-rose-600 mb-0.5 font-extrabold">Sangue</p>
                    <p class="text-[26px] leading-none font-black text-rose-600">O<span class="text-xl">+</span></p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Urgencies List Bento -->
            <div class="lg:col-span-7 bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col h-full overflow-hidden">
              <div class="p-6 md:p-8 pb-4 flex justify-between items-end">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <div class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </div>
                    Urgências
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">Hospitais na Província de Luanda</p>
                </div>
                <button class="text-[13px] font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Ver Mapa</button>
              </div>
              
              <div class="p-6 md:p-8 pt-0 space-y-3">
                
                <div class="group border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50 rounded-[20px] p-4 md:p-5 transition-all cursor-pointer flex justify-between items-center shadow-sm hover:shadow-md">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[16px] flex flex-col items-center justify-center font-bold text-white shadow-inner shadow-white/20">
                      <span class="text-lg leading-none">O-</span>
                      <span class="text-[9px] uppercase tracking-widest opacity-80 font-medium mt-0.5">Crítico</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-[15px] group-hover:text-rose-700 transition-colors">Instituto Nacional de Sangue</p>
                      <p class="text-[13px] text-gray-500 mt-1 flex items-center gap-1.5 font-medium"><MapPin class="w-3.5 h-3.5 text-gray-400"/> 2.4 km • Luanda</p>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform text-gray-400 group-hover:text-rose-600">
                    <Navigation class="w-4 h-4" stroke-width="2.5" />
                  </div>
                </div>

                <div class="group border border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50 rounded-[20px] p-4 md:p-5 transition-all cursor-pointer flex justify-between items-center shadow-sm hover:shadow-md">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-white border border-gray-200 text-gray-700 rounded-[16px] flex flex-col items-center justify-center font-bold shadow-sm">
                      <span class="text-lg leading-none">A+</span>
                      <span class="text-[9px] uppercase tracking-widest opacity-80 font-medium mt-0.5">Médio</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 text-[15px] group-hover:text-rose-700 transition-colors">Clínica Girassol</p>
                      <p class="text-[13px] text-gray-500 mt-1 flex items-center gap-1.5 font-medium"><MapPin class="w-3.5 h-3.5 text-gray-400"/> 5.1 km • Luanda</p>
                    </div>
                  </div>
                  <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform text-gray-400 group-hover:text-rose-600">
                    <Navigation class="w-4 h-4" stroke-width="2.5" />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
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