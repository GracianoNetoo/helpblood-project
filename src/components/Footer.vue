<script setup>
import { Droplet, Heart, Mail, Phone, MapPin } from 'lucide-vue-next';
const emit = defineEmits(['open-terms', 'open-privacy', 'open-help', 'open-about']);
</script>

<template>
  <footer class="bg-[#0F172A] text-gray-400 pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
    
    <!-- Abstract Background Elements -->
    <div class="absolute top-0 right-0 w-125 h-125 bg-rose-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-125 h-125 bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

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
            <div class="bg-rose-500 w-75 h-1"></div>
          </div>

          <div class="mt-5 space-y-3 text-[14px] font-medium text-gray-400">
            <div class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-rose-400" />
              <span>+244 900 000 000</span>
            </div>
            <div class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-rose-400" />
              <span>parcerias@univida.ao</span>
            </div>
            <div class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-rose-400" />
              <span>Luanda, Angola</span>
            </div>
          </div>
        </div>
        <!-- Links Columns -->
        <div class="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 class="text-white font-bold mb-6 text-[15px]">Plataforma</h4>
            <ul class="space-y-4 text-[14px] font-medium">
              <li><a href="#home" class="hover:text-rose-400 transition-colors">Página Inicial</a></li>

              <li><a href="#campanhas" class="hover:text-rose-400 transition-colors flex items-center gap-2">Como Funciona</a></li>
              <li><a href="#comofunciona" class="hover:text-rose-400 transition-colors flex items-center gap-2">Campanhas<span class="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Novo</span></a></li>
              <li><a href="#missao" class="hover:text-rose-400 transition-colors">Missão</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6 text-[15px]">Suporte</h4>
            <ul class="space-y-4 text-[14px] font-medium">
              <li><button type="button" @click="emit('open-about')" class="hover:text-rose-400 transition-colors">Sobre Nós</button></li>
              <li><button type="button" @click="emit('open-help')" class="hover:text-rose-400 transition-colors">Central de Ajuda</button></li>
              <li><button type="button" @click="emit('open-privacy')" class="hover:text-rose-400 transition-colors">Termos de Privacidade</button></li>
              <li><button type="button" @click="emit('open-terms')" class="hover:text-rose-400 transition-colors">Termos de Uso</button></li>
            </ul>
          </div>
          
          <div class="col-span-2 sm:col-span-1">
             <h4 class="text-white font-bold mb-6 text-[15px]">Fique Alerta</h4>
             <p class="text-[13px] font-medium leading-relaxed mb-4">Receba notificações de campanhas proximas de si.</p>
             <div class="flex flex-col gap-2">
               <input type="email" placeholder="O seu e-mail" class="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-rose-500 transition-colors placeholder:text-gray-600">
               <button class="bg-white text-gray-900 font-bold rounded-xl px-4 py-2.5 text-[14px] hover:bg-rose-50 transition-colors">Subscrever</button>
             </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] font-medium">
        <p>&copy; 2026 UniVida Angola. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
</template>






