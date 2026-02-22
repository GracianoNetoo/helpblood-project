<script setup>
import { defineEmits } from 'vue';
import DonorCard from './DonorCard.vue';
const emit = defineEmits(['logout']);
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    
    <aside class="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col shrink-0">
      <div class="p-6">
        <div class="ps-4 mb-10">
          <a class="text-[31px] text-red-600 font-extrabold">UniVida</a>
        </div>
        
        <nav class="space-y-2">
          <a href="#" class="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-xl font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Início
          </a>
          <a href="#" class="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            Pedidos de Doação
          </a>
          <a href="#" class="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Agendamentos
          </a>
        </nav>
      </div>
      
      <div class="mt-auto p-6 border-t border-gray-100">
        <button @click="emit('logout')" class="flex items-center gap-3 text-gray-400 hover:text-red-600 transition-all w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Sair da conta
        </button>
      </div>
    </aside>

    <main class="flex-1 p-4 md:p-10 overflow-y-auto">
      
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Olá, Manuel! </h1>
          <p class="text-gray-500 text-sm">Que bom ver você disposto a ajudar hoje.</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right hidden md:block">
            <p class="text-sm font-bold text-slate-900">Tipo Sanguíneo</p>
            <p class="text-xs text-red-600 font-black">O Positivo (O+)</p>
          </div>
          <div class="w-12 h-12 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Manuel" alt="Avatar">
          </div>
        </div>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="md:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-lg opacity-80 mb-2">Próxima Doação</h3>
            <p class="text-3xl font-black mb-6">Você está apto para doar!</p>
            <button class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold transition-all">
              Ver Hemocentros Próximos
            </button>
          </div>
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-red-600/20 rounded-full blur-3xl"></div>
        </div>

        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div class="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <p class="text-4xl font-black text-slate-900">04</p>
          <p class="text-gray-500 text-sm">Vidas salvas até agora</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm mb-10">
        <div class="max-w-md">
          <h3 class="text-3xl font-black text-slate-900 mb-4">Seu Cartão Digital está pronto!</h3>
          <p class="text-gray-500 mb-6">Apresente este cartão nos postos de recolha para agilizar o seu atendimento e manter o seu histórico atualizado.</p>
          <button class="btn btn-outline border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-2xl px-8 h-14 font-bold">
            Descarregar em PDF
          </button>
        </div>
        
        <div class="flex justify-center lg:justify-end">
          <DonorCard 
            nome="Manuel Francisco" 
            tipo="O+" 
            bi="007241052LA041" 
          />
        </div>
      </div>

      <div class="mt-10">
        <h3 class="text-xl font-bold text-slate-900 mb-6">Urgências na sua Província (Luanda)</h3>
        <div class="space-y-4">
          <div class="bg-white p-5 rounded-2xl border-l-4 border-red-600 shadow-sm flex justify-between items-center">
            <div class="flex gap-4 items-center">
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center font-bold text-red-600 text-xl">O-</div>
              <div>
                <p class="font-bold text-slate-900">Instituto Nacional de Sangue</p>
                <p class="text-sm text-gray-500 italic">Estoque Crítico • Necessário 20 bolsas</p>
              </div>
            </div>
            <button class="text-sm font-bold text-red-600 hover:underline">Como chegar</button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>