<script setup>
import { MapPin, CalendarDays, ArrowRight, ShieldCheck, Heart, Users } from 'lucide-vue-next';
</script>

<template>
  <section class="py-24 bg-white relative overflow-hidden">
    <!-- Abstract subtle background element -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-[radial-gradient(circle_at_center,#f8fafc_0%,transparent_70%)] pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10">
      
      <!-- Section Header aligned with Hero typography -->
      <div class="text-center max-w-[600px] mx-auto mb-20">
        <div class="inline-flex items-center justify-center gap-2 mb-4">
          <span class="text-[12px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-full">Como Funciona</span>
        </div>
        <h2 class="text-3xl md:text-[40px] font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
          O seu caminho para <span class="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-orange-400">salvar vidas.</span>
        </h2>
        <p class="text-[17px] text-gray-500 font-medium">
          Um processo simples, rápido e totalmente digital, desenhado para maximizar o seu impacto.
        </p>
      </div>

      <!-- Steps Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative max-w-6xl mx-auto">
        
        <!-- Connecting Line (Desktop) -->
        <div class="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-linear-to-r from-rose-100 via-rose-200 to-rose-100 z-0"></div>

        <!-- Step 1 -->
        <div class="group bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(225,29,72,0.06)] hover:border-rose-100 transition-all duration-300 relative z-10 flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-white border border-rose-100 text-rose-600 rounded-[24px] flex items-center justify-center mb-8 shadow-sm group-hover:bg-rose-50 group-hover:scale-110 transition-transform duration-500">
            <MapPin class="w-8 h-8" stroke-width="2" />
          </div>
          <span class="absolute top-10 right-10 text-[60px] font-black text-gray-50/80 -z-10 group-hover:text-rose-50/50 transition-colors">1</span>
          <h3 class="text-xl font-bold text-gray-900 mb-4 tracking-tight">Encontre o Local</h3>
          <p class="text-[15px] text-gray-500 font-medium leading-relaxed">
            Localize os hemocentros com maior necessidade ou as campanhas móveis mais próximas de você.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="group bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(225,29,72,0.06)] hover:border-rose-100 transition-all duration-300 relative z-10 flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-white border border-rose-100 text-rose-600 rounded-[24px] flex items-center justify-center mb-8 shadow-sm group-hover:bg-rose-50 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck class="w-8 h-8" stroke-width="2" />
          </div>
          <span class="absolute top-10 right-10 text-[60px] font-black text-gray-50/80 -z-10 group-hover:text-rose-50/50 transition-colors">2</span>
          <h3 class="text-xl font-bold text-gray-900 mb-4 tracking-tight">Agendamento Fácil</h3>
          <p class="text-[15px] text-gray-500 font-medium leading-relaxed">
            Valide os requisitos online e marque o seu horário para evitar filas e garantir um atendimento seguro.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="group bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(225,29,72,0.06)] hover:border-rose-100 transition-all duration-300 relative z-10 flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-white border border-rose-100 text-rose-600 rounded-[24px] flex items-center justify-center mb-8 shadow-sm group-hover:bg-rose-50 group-hover:scale-110 transition-transform duration-500">
            <Heart class="w-8 h-8" stroke-width="2" />
          </div>
          <span class="absolute top-10 right-10 text-[60px] font-black text-gray-50/80 -z-10 group-hover:text-rose-50/50 transition-colors">3</span>
          <h3 class="text-xl font-bold text-gray-900 mb-4 tracking-tight">Doe e Acompanhe</h3>
          <p class="text-[15px] text-gray-500 font-medium leading-relaxed">
            Faça a doação e acompanhe o trajeto do seu sangue até o momento em que ele salva uma vida.
          </p>
        </div>

      </div>

      <!-- Call to Action -->
      <div class="mt-16 text-center">
        <button class="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-bold text-[15px] shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5">
          <CalendarDays class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" stroke-width="2.5" />
          Agende sua primeira doação
        </button>
      </div>

    </div>
  </section>
</template>