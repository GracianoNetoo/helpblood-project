<script setup>
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-vue-next';
import { dismissToast, useToastState } from '@/core/services/toastService';

const { toasts } = useToastState();

const variantMap = {
  error: {
    icon: AlertCircle,
    container: 'border-rose-200 bg-white text-slate-900 shadow-[0_18px_40px_rgba(225,29,72,0.14)]',
    badge: 'bg-rose-100 text-rose-700',
    title: 'text-rose-700'
  },
  success: {
    icon: CheckCircle2,
    container: 'border-emerald-200 bg-white text-slate-900 shadow-[0_18px_40px_rgba(5,150,105,0.14)]',
    badge: 'bg-emerald-100 text-emerald-700',
    title: 'text-emerald-700'
  },
  info: {
    icon: Info,
    container: 'border-sky-200 bg-white text-slate-900 shadow-[0_18px_40px_rgba(2,132,199,0.14)]',
    badge: 'bg-sky-100 text-sky-700',
    title: 'text-sky-700'
  }
};

const getVariant = (type) => variantMap[type] || variantMap.info;
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(92vw,26rem)] flex-col gap-3">
    <TransitionGroup
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
      move-class="transition duration-200 ease-in-out"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['pointer-events-auto rounded-[24px] border p-4 backdrop-blur-sm', getVariant(toast.type).container]"
      >
        <div class="flex items-start gap-3">
          <div :class="['mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', getVariant(toast.type).badge]">
            <component :is="getVariant(toast.type).icon" class="h-5 w-5" />
          </div>

          <div class="min-w-0 flex-1">
            <p v-if="toast.title" :class="['text-sm font-extrabold', getVariant(toast.type).title]">{{ toast.title }}</p>
            <p class="mt-1 text-sm font-medium leading-relaxed text-slate-600">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            @click="dismissToast(toast.id)"
            aria-label="Fechar notificacao"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
