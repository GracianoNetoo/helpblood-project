<script setup>
import { Heart, Activity, ArrowRight, ShieldCheck, Users } from 'lucide-vue-next';
</script>

<template>
  <main id="home" class="pt-0 bg-[#FAFAFA] relative overflow-hidden font-sans border-b border-gray-200/50">
    
    <!-- Hero Section (21st.dev / Vercel style) -->
    <section class="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden px-4 md:px-0">
      
      <!-- Abstract Background Mesh -->
      <div class="absolute inset-0 z-0 bg-white">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-100 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        <div class="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] bg-size-[16px_16px] opacity-40 mix-blend-multiply"></div>
      </div>

      <!-- Main Content -->
      <div class="relative z-10 text-center max-w-[800px] mx-auto mt-10 md:mt-16">
        
        <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-rose-200 shadow-[0_2px_10px_rgba(225,29,72,0.06)] mb-8 transform transition-transform hover:scale-105 cursor-default">
          <span class="flex h-2 w-2 relative">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span class="text-[12px] font-bold text-rose-600 uppercase tracking-widest">Urgência: O- em Luanda</span>
        </div>

        <h1 class="text-[40px] md:text-[72px] font-extrabold text-gray-900 mb-6 leading-[1.05] tracking-tight">
          O seu sangue pode<br/>
          <span class="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-orange-400">salvar 4 vidas</span> hoje.
        </h1>

        <p class="text-[17px] md:text-[20px] text-gray-500 mb-10 max-w-[600px] mx-auto leading-relaxed font-medium">
          A UniVida é a plataforma mais rápida e segura que liga dadores voluntários aos hospitais com maior necessidade em Angola. Torne-se um herói da vida real.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            class="group w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-bold text-[15px] shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Quero Doar Agora
            <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1" stroke-width="2.5" />
          </button>
          
          <button
            class="group w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 rounded-full font-bold text-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
            Pedir Doação
          </button>
        </div>

        <!-- Trusted Badge -->
        <div class="mt-14 pt-8 border-t border-gray-200/60 max-w-sm mx-auto flex items-center justify-center gap-3">
          <div class="flex -space-x-3">
            <div class="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" alt="Avatar"></div>
            <div class="w-8 h-8 rounded-full border-2 border-white bg-rose-200 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" alt="Avatar"></div>
            <div class="w-8 h-8 rounded-full border-2 border-white bg-orange-200 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=C" alt="Avatar"></div>
            <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">+2k</div>
          </div>
          <p class="text-sm font-semibold text-gray-500">Dadores registados</p>
        </div>
      </div>

    </section>

    <!-- Stats Section (Float up slightly into hero) -->
    <section class="max-w-5xl mx-auto px-4 relative z-20 pb-20 -mt-10">
      <div class="bg-white rounded-[32px] border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        
        <div class="flex-1 text-center px-4 w-full pt-4 md:pt-0">
          <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-[16px] mx-auto flex items-center justify-center mb-4 border border-rose-100/50">
            <Heart class="w-6 h-6" stroke-width="2.5" />
          </div>
          <p class="text-4xl font-extrabold text-gray-900 tracking-tight">1.2k<span class="text-rose-600">+</span></p>
          <p class="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Vidas Salvas</p>
        </div>
        
        <div class="flex-1 text-center px-4 w-full pt-8 md:pt-0">
          <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[16px] mx-auto flex items-center justify-center mb-4 border border-emerald-100/50">
            <Users class="w-6 h-6" stroke-width="2.5" />
          </div>
          <p class="text-4xl font-extrabold text-gray-900 tracking-tight">850</p>
          <p class="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Ativos Hoje</p>
        </div>
        
        <div class="flex-1 text-center px-4 w-full pt-8 md:pt-0">
          <div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-[16px] mx-auto flex items-center justify-center mb-4 border border-orange-100/50">
            <Activity class="w-6 h-6" stroke-width="2.5" />
          </div>
          <p class="text-4xl font-extrabold text-gray-900 tracking-tight">4<span class="text-orange-600">h</span></p>
          <p class="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Tempo Médio Resposta</p>
        </div>
        
        <div class="flex-1 text-center px-4 w-full pt-8 md:pt-0">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-[16px] mx-auto flex items-center justify-center mb-4 border border-blue-100/50">
            <ShieldCheck class="w-6 h-6" stroke-width="2.5" />
          </div>
          <p class="text-4xl font-extrabold text-gray-900 tracking-tight">100<span class="text-blue-600">%</span></p>
          <p class="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Hospitais Verificados</p>
        </div>
        
      </div>
    </section>

  </main>
</template>