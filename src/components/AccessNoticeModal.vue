<script setup>
import { Lock, Info } from 'lucide-vue-next';

const emit = defineEmits(['close']);
</script>

<template>
  <div class="bg-white rounded-[28px] shadow-2xl border border-white/20 overflow-hidden max-w-lg w-full">
    <div class="p-6 md:p-7 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">Acesso restrito</h2>
        <p class="text-sm text-gray-500 mt-1">Funcionalidade em desenvolvimento</p>
      </div>
      <button @click="$emit('close')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <div class="p-6 md:p-7">
      <div class="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-[18px] p-4">
        <div class="w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
          <Lock class="w-5 h-5" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900">Rotas indisponíveis</p>
          <p class="text-[13px] text-gray-600 mt-1 leading-relaxed">
            No momento, a opção <span class="font-semibold">Ver Rota</span> está disponível apenas para utilizadores da plataforma.
          </p>
          <p class="text-[12px] text-gray-500 mt-3 flex items-center gap-2">
            <Info class="w-4 h-4" />
            Em breve vamos liberar para todos.
          </p>
        </div>
      </div>

      <div class="mt-5 flex gap-3">
        <button @click="$emit('close')" class="flex-1 px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-colors">
          Entendi
        </button>
      </div>
    </div>
  </div>
</template>
