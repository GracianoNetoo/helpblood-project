<script setup>
import { Droplet, ArrowRight, ShieldCheck, Heart, Users } from 'lucide-vue-next';
</script>

<template>
  <footer class="bg-[#0F172A] text-gray-400 pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
    
    <!-- Abstract Background Elements -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10">
      
      <!-- Top Section -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        
        <!-- Brand Column -->
        <div class="md:col-span-5">
          <div class="flex items-center gap-2.5 mb-6">
            <Droplet class="w-6 h-6 text-rose-500" stroke-width="2.5" />
            <span class="text-2xl font-black text-white tracking-tight">UniVida</span>
          </div>
          <p class="text-[15px] leading-relaxed mb-8 max-w-[320px] font-medium text-gray-400">
            A infraestrutura digital de conexão entre a vontade de ajudar e a necessidade crítica de salvar vidas em Angola.
          </p>
          <div class="flex gap-3">
             <a href="#" class="w-10 h-10 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-gray-400 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all text-gray-400 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div class="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 class="text-white font-bold mb-6 text-[15px]">Plataforma</h4>
            <ul class="space-y-4 text-[14px] font-medium">
              <li><a href="#" class="hover:text-rose-400 transition-colors">Como Doar</a></li>
              <li><a href="#" class="hover:text-rose-400 transition-colors flex items-center gap-2">Campanhas <span class="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Novo</span></a></li>
              <li><a href="#" class="hover:text-rose-400 transition-colors">Hemocentros</a></li>
              <li><a href="#" class="hover:text-rose-400 transition-colors">Requisitos</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6 text-[15px]">Suporte</h4>
            <ul class="space-y-4 text-[14px] font-medium">
              <li><a href="#" class="hover:text-rose-400 transition-colors">Central de Ajuda</a></li>
              <li><a href="#" class="hover:text-rose-400 transition-colors">Privacidade</a></li>
              <li><a href="#" class="hover:text-rose-400 transition-colors">Termos de Uso</a></li>
              <li><a href="#" class="hover:text-rose-400 transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div class="col-span-2 sm:col-span-1">
             <h4 class="text-white font-bold mb-6 text-[15px]">Fique Alerta</h4>
             <p class="text-[13px] font-medium leading-relaxed mb-4">Receba notificações de urgências na sua província.</p>
             <div class="flex flex-col gap-2">
               <input type="email" placeholder="O seu e-mail" class="bg-white/5 border border-white/10 rounded-[12px] px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-rose-500 transition-colors placeholder:text-gray-600">
               <button class="bg-white text-gray-900 font-bold rounded-[12px] px-4 py-2.5 text-[14px] hover:bg-rose-50 transition-colors">Subscrever</button>
             </div>
          </div>
        </div>

      </div>

      <!-- Bottom Section -->
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] font-medium">
        <p>&copy; 2026 UniVida Angola. Todos os direitos reservados.</p>
        <div class="flex items-center gap-1.5 opacity-60">
           <span>Feito com</span>
           <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
           <span>para salvar vidas.</span>
        </div>
      </div>
    </div>
  </footer>
</template>