<script setup>
import { MapPin, CalendarDays, ArrowRight, Activity, Plus, FileText, ArrowUpRight } from 'lucide-vue-next';
</script>

<template>
  <section id="campanhas" class="py-24 bg-[#FAFAFA] relative overflow-hidden border-t border-gray-100">
    <div class="container mx-auto px-6 max-w-7xl relative z-10">

      <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 w-full">
        <div class="max-w-[700px]">
          <div class="inline-flex items-center justify-center gap-2 mb-4">
            <span class="text-[12px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-full">Mobilização</span>
          </div>
          <p class="text-[32px] md:text-[48px] font-extrabold text-gray-900 tracking-tight leading-[1.05]">
            Campanhas de Unidade
          </p>
          <p class="text-[17px] text-gray-500 font-medium mt-4 leading-relaxed">
            Descubra eventos locais, unidades móveis e campanhas de urgência organizadas por hemocentros e instituições parceiras para fortalecer o nosso estoque nacional.
          </p>
        </div>
        <button class="shrink-0 text-[13px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-full px-5 py-2.5 flex items-center gap-2 hover:bg-rose-600 hover:text-white transition-all duration-300">
          Explorar o Mapa Completo
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Bento Grid for Campaigns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Critical Campaign Card -->
        <div class="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(225,29,72,0.06)] hover:border-rose-100 border border-gray-100 group transition-all duration-500 flex flex-col relative z-20">
          <!-- Image Section -->
          <div class="h-[220px] overflow-hidden relative">
            <div class="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
            <!-- Urgency Badge -->
            <div class="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-rose-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full z-20 uppercase tracking-widest shadow-lg shadow-rose-600/30">
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Crítico
            </div>
            
            <!-- Type Needs -->
            <div class="absolute top-4 right-4 flex gap-1 z-20">
              <span class="bg-white/20 backdrop-blur-md text-white md:px-2 md:py-1 rounded-md text-[10px] font-black tracking-wider border border-white/20">O-</span>
              <span class="bg-white/20 backdrop-blur-md text-white md:px-2 md:py-1 rounded-md text-[10px] font-black tracking-wider border border-white/20">A+</span>
            </div>

            <img src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=800"
                 alt="Hospital Mutamba"
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
          </div>
          
          <!-- Content Section -->
          <div class="p-8 flex flex-col flex-1 transform translate-y-0 relative z-30 bg-white group-hover:-translate-y-2 transition-transform duration-500 rounded-b-[32px] border-t border-gray-50 -mt-2">
            <div class="flex items-center gap-4 text-[13px] font-semibold text-gray-400 mb-4 bg-gray-50 w-fit px-3 py-1.5 rounded-full">
              <span class="flex items-center gap-1.5 text-gray-700">
                <MapPin class="w-[14px] h-[14px] text-rose-500" stroke-width="2.5" /> Luanda
              </span>
              <span class="w-[3px] h-[3px] rounded-full bg-gray-300"></span>
              <span class="flex items-center gap-1.5">
                <CalendarDays class="w-[14px] h-[14px]" stroke-width="2" /> Hoje, 10h - 15h
              </span>
            </div>
            <h3 class="text-[20px] font-extrabold text-gray-900 mb-3 tracking-tight leading-[1.2]">Mutirão Nacional: Universidade Agostinho Neto</h3>
            <p class="text-gray-500 text-[15px] font-medium leading-relaxed mb-8 flex-1">
              Unidade Móvel estabelecida em frente à Reitoria. Nosso foco é a estabilização urgente do banco de sangue central.
            </p>
            <button class="w-full py-4 text-[14px] bg-white border-2 border-gray-100 text-gray-900 font-bold rounded-[16px] group-hover:bg-gray-900 group-hover:border-gray-900 group-hover:text-white transition-all flex items-center justify-center gap-2">
              Ver Rota
              <ArrowUpRight class="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>

        <!-- Drive Campaign Card -->
        <div class="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-gray-200 border border-gray-100 group transition-all duration-500 flex flex-col relative z-20">
          <!-- Image Section -->
          <div class="h-[220px] overflow-hidden relative">
            <div class="absolute inset-0 bg-linear-to-t from-gray-900/40 to-transparent z-10 transition-opacity group-hover:opacity-60"></div>
            <!-- Type Needs -->
            <div class="absolute top-4 right-4 flex gap-1 z-20">
              <span class="bg-white/20 backdrop-blur-md text-white md:px-2 md:py-1 rounded-md text-[10px] font-black tracking-wider border border-white/20">Todos</span>
            </div>

            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
                 alt="Campanha Benguela"
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
          </div>
          
          <!-- Content Section -->
          <div class="p-8 flex flex-col flex-1 transform translate-y-0 relative z-30 bg-white group-hover:-translate-y-2 transition-transform duration-500 rounded-b-[32px] border-t border-gray-50 -mt-2">
            <div class="flex items-center gap-4 text-[13px] font-semibold text-gray-400 mb-4 bg-gray-50 w-fit px-3 py-1.5 rounded-full">
              <span class="flex items-center gap-1.5 text-gray-700">
                <MapPin class="w-[14px] h-[14px] text-gray-400" stroke-width="2.5" /> Benguela
              </span>
              <span class="w-[3px] h-[3px] rounded-full bg-gray-300"></span>
              <span class="flex items-center gap-1.5">
                <CalendarDays class="w-[14px] h-[14px]" stroke-width="2" /> Próx Sáb, 08h
              </span>
            </div>
            <h3 class="text-[20px] font-extrabold text-gray-900 mb-3 tracking-tight leading-[1.2]">Ação Comunitária Praia Morena</h3>
            <p class="text-gray-500 text-[15px] font-medium leading-relaxed mb-8 flex-1">
              Junte-se a dezenas de voluntários num fim de semana especial. Teremos postos avançados de triagem disponíveis.
            </p>
            <button class="w-full py-4 text-[14px] bg-white border-2 border-gray-100 text-gray-900 font-bold rounded-[16px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              Agendar Horário
              <ArrowRight class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Call to Action Banner (Bento Integration) -->
        <div class="bg-linear-to-br from-[#0F172A] to-[#1E293B] rounded-[32px] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl h-full">
            <!-- Glow Effects -->
            <div class="absolute -right-[150px] -bottom-[150px] w-[350px] h-[350px] bg-rose-500/30 rounded-full blur-[100px] group-hover:bg-orange-500/30 transition-all duration-1000 pointer-events-none"></div>
            <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] opacity-10 mix-blend-overlay pointer-events-none"></div>
            
            <div class="relative z-10 h-full flex flex-col justify-start">
              <div class="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-[20px] flex items-center justify-center mb-10 shadow-lg">
                <Plus class="w-8 h-8" stroke-width="2.5" />
              </div>
              <h3 class="text-[28px] font-extrabold tracking-tight mb-4 leading-tight">Quer hospedar uma campanha?</h3>
              <p class="text-gray-400 text-[16px] leading-relaxed font-medium mb-12 flex-1">
                Universidades, Igrejas ou Empresas - Leve o nosso ecossistema de doação até ao seu espaço com uma Unidade Móvel dedicada.
              </p>
              <button class="w-full bg-white text-gray-900 px-6 py-4 rounded-[16px] font-extrabold text-[14px] uppercase tracking-wider hover:bg-gray-100 hover:scale-[1.02] shadow-[0_4px_14px_rgba(255,255,255,0.2)] transition-all flex justify-center items-center gap-2">
                Solicitar Parceria
                <FileText class="w-4 h-4 opacity-50" stroke-width="2.5" />
              </button>
            </div>
        </div>

      </div>
    </div>
  </section>
</template>