<script setup>
import { Plus } from 'lucide-vue-next';
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10">
      
      <div class="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Meus Agendamentos</h2>
          <p class="text-sm text-gray-500 mt-1">Gira as suas idas aos postos de Saúde.</p>
        </div>
        <button class="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 text-sm">
          <Plus class="w-4 h-4" stroke-width="2.5" />
          Nova Marcação
        </button>
      </div>

      <!-- Blank State para Agendamentos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Add empty state blocks or skeletons -->
        <div class="border border-gray-100 bg-gray-50/50 rounded-[20px] p-6 text-center animate-pulse h-48"></div>
        <div class="border border-gray-100 bg-gray-50/50 rounded-[20px] p-6 text-center animate-pulse h-48"></div>
      </div>
    
    </div>
  </div>
</template>
