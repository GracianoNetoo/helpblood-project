<script setup>
import { MapPin, CalendarDays, ArrowRight, ShieldCheck, Heart, Info, Target, Shield, Zap } from 'lucide-vue-next';
</script>

<template>
  <section class="py-24 bg-[#FAFAFA] relative overflow-hidden">
    
    <!-- Abstract Mesh Background for About Section -->
    <div class="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 mix-blend-multiply"></div>
    <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

    <div class="container mx-auto px-6 relative z-10 max-w-6xl">
      <div class="flex flex-col lg:flex-row items-center gap-16">

        <!-- Image Bento Box -->
        <div class="w-full lg:w-1/2 relative">
          
          <!-- Image Container with Polish -->
          <div class="relative bg-white p-2 md:p-4 rounded-[32px] md:rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100/80 z-20 group h-auto max-w-[500px] mx-auto">
            
            <div class="absolute inset-0 border-[3px] border-white/40 rounded-[32px] md:rounded-[40px] pointer-events-none z-10"></div>
            
            <div class="overflow-hidden rounded-[24px] md:rounded-[32px] relative bg-gray-100 aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1615461066159-fea0960485d5?q=80&w=1400&auto=format&fit=crop" 
                   alt="Equipe médica trabalhando" 
                   class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
              
              <!-- Subtle gradient overlay -->
              <div class="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent"></div>
              
              <!-- Mission Tag Floating -->
              <div class="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 group-hover:translate-y-[-4px] transition-transform duration-500">
                <div class="inline-flex items-center gap-2 mb-3 bg-white/20 backdrop-blur-md text-white rounded-full px-4 py-2 text-[13px] font-bold tracking-widest uppercase shadow-sm border border-white/20">
                  <Target class="w-4 h-4 text-rose-300" stroke-width="2.5" />
                  Nossa Missão
                </div>
                <p class="text-[17px] md:text-xl font-bold leading-tight text-white drop-shadow-md">
                  Reduzir a zero o tempo de espera entre a urgência e a doação de sangue.
                </p>
              </div>
            </div>

            <!-- Floating Badge Stats -->
            <div class="absolute -right-4 -top-4 md:-right-8 md:-top-8 bg-white p-4 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-4 z-30 transform hover:scale-105 transition-transform duration-300">
              <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-[16px] flex items-center justify-center border border-rose-100">
                <Heart class="w-6 h-6" stroke-width="2.5" />
              </div>
              <div>
                <p class="text-[28px] font-extrabold text-gray-900 leading-none mb-1 tracking-tight">24<span class="text-rose-600">/</span>7</p>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Suporte Contínuo</p>
              </div>
            </div>
            
          </div>
        </div>

        <!-- Content Area -->
        <div class="w-full lg:w-1/2">
          
          <div class="inline-flex items-center justify-center gap-2 mb-4">
            <span class="text-[12px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1.5 rounded-full">O Propósito</span>
          </div>
          
          <h2 class="text-3xl md:text-[44px] font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
            Muito mais que uma plataforma. <br/>Uma rede de <span class="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-orange-400">Heróis.</span>
          </h2>
          
          <div class="space-y-6 text-[17px] text-gray-500 font-medium leading-[1.6] mb-10">
            <p>
              Milhares de procedimentos médicos em Angola são adiados rotineiramente pela escassez nos hemocentros. Percebemos cedo que o problema real não era a falta de doadores dispostos, mas sim a <strong>falta de uma conexão eficiente.</strong>
            </p>
            <p>
              A UniVida nasceu para silenciar os pedidos desesperados nas redes sociais. Nós fornecemos uma ponte inteligente que identifica precisamente onde há uma urgência crítica e notifica imediatamente quem pode ajudar.
            </p>
          </div>

          <!-- Feature Bullets (Linear approach) -->
          <ul class="space-y-4 mb-10">
            <li class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 border border-orange-100">
                <Zap class="w-4 h-4" stroke-width="2.5" />
              </div>
              <div>
                <h4 class="text-[15px] font-bold text-gray-900 mb-1">Notificações Inteligentes</h4>
                <p class="text-[14px] text-gray-500 font-medium">Alertas baseados na proximidade e compatibilidade sanguínea.</p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                <Shield class="w-4 h-4" stroke-width="2.5" />
              </div>
              <div>
                <h4 class="text-[15px] font-bold text-gray-900 mb-1">Privacidade Garantida</h4>
                <p class="text-[14px] text-gray-500 font-medium">Os seus dados médicos geridos de forma anónima e restrita.</p>
              </div>
            </li>
          </ul>

          <!-- Trust Badges -->
          <div class="flex items-center gap-5 pt-8 border-t border-gray-200">
            <div class="flex -space-x-4 border-r border-gray-200 pr-5">
              <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=D" alt="Avatar"></div>
              <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=E" alt="Avatar"></div>
              <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=F" alt="Avatar"></div>
            </div>
            <div>
              <p class="text-[13px] font-bold text-gray-900 leading-tight mb-0.5">Apoiado por Médicos</p>
              <p class="text-[12px] font-semibold text-gray-400">Verificado pelos Hemocentros Nacionais</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>