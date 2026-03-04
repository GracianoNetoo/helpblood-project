<script setup>
import { ref } from 'vue';
import { Mail, ArrowRight } from 'lucide-vue-next';

const emit = defineEmits(['close']);
const selected = ref('');

const selectChannel = (channel) => {
  selected.value = channel;
};

const handleContact = () => {
  if (!selected.value) return;
  emit('close');
};
</script>

<template>
  <div class="bg-white rounded-[28px] shadow-2xl border border-white/20 overflow-hidden max-w-2xl w-full">
    <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Solicitar Parceria</h2>
        <p class="text-sm text-gray-500 mt-1">Escolha o melhor canal para entrarmos em contacto.</p>
      </div>
      <button @click="$emit('close')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <div class="p-6 md:p-8">
      <div class="grid grid-cols-1 gap-4 text-center">
        <div class="bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4">
          <p class="text-[13px] font-semibold text-gray-500">Canais disponíveis</p>
          <p class="text-sm text-gray-700 mt-1">Selecione um para desbloquear o botão de contacto.</p>
        </div>

        <div class="flex items-center justify-center gap-4 md:gap-6">
          <button
            type="button"
            @click="selectChannel('facebook')"
            class="w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center shadow-sm"
            :class="selected === 'facebook' ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" class="w-7 h-7 fill-current">
              <path d="M13 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z"/>
            </svg>
          </button>

          <button
            type="button"
            @click="selectChannel('whatsapp')"
            class="w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center shadow-sm"
            :class="selected === 'whatsapp' ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" class="w-7 h-7 fill-current block">
              <path d="M20.5 3.5A11 11 0 0 0 3 16.7L2 22l5.4-1.8A11 11 0 1 0 20.5 3.5zm-9 17.2a9.2 9.2 0 0 1-4.7-1.3l-.3-.2-2.8.9.9-2.7-.2-.3a9.2 9.2 0 1 1 7.1 3.6zm5.4-6.2c-.3-.1-1.7-.8-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a7.5 7.5 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.5.1-.6l.4-.5c.2-.2.3-.3.4-.5s.1-.3 0-.5c-.1-.1-.7-1.6-.9-2.1-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4s-.2-.2-.5-.3z"/>
            </svg>
          </button>

          <button
            type="button"
            @click="selectChannel('email')"
            class="w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center shadow-sm"
            :class="selected === 'email' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'"
          >
            <Mail class="w-7 h-7" />
          </button>
        </div>

        <div class="mt-2 flex items-center justify-center gap-2 text-[12px] text-gray-500 font-semibold">
          <span class="w-2 h-2 rounded-full" :class="selected ? 'bg-emerald-500' : 'bg-gray-300'"></span>
          <span>{{ selected ? `Canal selecionado: ${selected}` : 'Nenhum canal selecionado' }}</span>
        </div>
      </div>
    </div>

    <div class="p-6 md:p-8 border-t border-gray-100 flex gap-3">
      <button @click="$emit('close')" class="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-bold transition-colors">
        Cancelar
      </button>
      <button
        @click="handleContact"
        :disabled="!selected"
        class="flex-1 px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Entrar em contacto
        <ArrowRight class="w-4 h-4 opacity-70" />
      </button>
    </div>
  </div>
</template>
