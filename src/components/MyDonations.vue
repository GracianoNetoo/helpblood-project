<script setup>
import { History, CalendarDays } from 'lucide-vue-next';
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Histórico de Doações</h2>
          <p class="text-sm text-gray-500 mt-1">Registo das suas contribuições para a comunidade.</p>
        </div>
        <button class="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 text-sm">
          <History class="w-4 h-4" />
          Filtrar Histórico
        </button>
      </div>

      <!-- Placeholder content for My Donations -->
      <div class="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-[24px]">
        <div class="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-full mb-4">
          <CalendarDays class="w-8 h-8 text-blue-400" />
        </div>
        <h3 class="text-lg font-bold text-gray-900">Ainda não fez nenhuma doação registada</h3>
        <p class="text-sm text-gray-500 max-w-sm mt-2">Agende a sua primeira doação e comece a salvar vidas através das nossas recolhas parceiras.</p>
        <button class="mt-6 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all">
          Agendar Agora
        </button>
      </div>
    </div>
  </div>
</template>
