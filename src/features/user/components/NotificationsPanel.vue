<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { AlertCircle, Bell, CalendarDays, CheckCheck, Info, Megaphone, ShieldCheck, Trash2, X } from 'lucide-vue-next';
import { useNotificationsStore } from '../store/notificationsStore';

const emit = defineEmits(['close', 'open-tab']);

const notificationsStore = useNotificationsStore();
const { notifications, unreadCount } = storeToRefs(notificationsStore);

const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

const formatRelativeDate = (value) => {
  if (!value) return 'Agora';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const diff = Date.now() - parsed.getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  return `${days} d`;
};

const getVariantClasses = (type) => {
  if (type === 'success') {
    return {
      card: 'border-emerald-100 bg-emerald-50/60',
      icon: 'bg-emerald-100 text-emerald-700'
    };
  }
  if (type === 'warning') {
    return {
      card: 'border-amber-100 bg-amber-50/70',
      icon: 'bg-amber-100 text-amber-700'
    };
  }
  return {
    card: 'border-slate-200 bg-white',
    icon: 'bg-sky-100 text-sky-700'
  };
};

const getVariantIcon = (notification) => {
  if (notification.actionTab === 'appointments') return CalendarDays;
  if (notification.actionTab === 'campaigns') return Megaphone;
  if (notification.type === 'success') return ShieldCheck;
  return AlertCircle;
};

const getActionTabLabel = (actionTab) => {
  if (actionTab === 'appointments') return 'agendamentos';
  if (actionTab === 'campaigns') return 'campanhas';
  if (actionTab === 'donations') return 'doações';
  if (actionTab === 'emergencies') return 'pedidos de ajuda';
  return actionTab;
};

const openNotification = (notification) => {
  notificationsStore.markAsRead(notification.id);
  if (notification.actionTab) {
    emit('open-tab', notification.actionTab);
  }
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-40">
    <div class="absolute inset-0 bg-slate-900/25 backdrop-blur-[1px]" @click="emit('close')"></div>

    <div class="absolute right-4 top-24 z-10 w-[min(92vw,28rem)] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.16)]">
      <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5">
        <div class="flex items-start gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Bell class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[11px] font-black uppercase tracking-[0.18em] text-rose-600">Notificações</p>
            <h3 class="mt-1 text-xl font-black tracking-tight text-slate-900">Centro de alertas</h3>
            <p class="mt-1 text-sm text-slate-500">{{ unreadCount }} por ler</p>
          </div>
        </div>

        <button
          type="button"
          @click="emit('close')"
          class="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Fechar notificações"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="flex items-center justify-between gap-3 px-5 py-4">
        <button
          type="button"
          @click="notificationsStore.markAllAsRead()"
          class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100"
        >
          <CheckCheck class="h-4 w-4" />
          Marcar tudo
        </button>

        <button
          type="button"
          @click="notificationsStore.clearNotifications()"
          class="inline-flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
        >
          <Trash2 class="h-4 w-4" />
          Limpar
        </button>
      </div>

      <div class="max-h-[65vh] space-y-3 overflow-y-auto px-5 pb-5">
        <div
          v-if="sortedNotifications.length === 0"
          class="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center"
        >
          <Info class="mx-auto h-6 w-6 text-slate-300" />
          <p class="mt-3 text-sm font-semibold text-slate-600">Ainda não existem notificações para este perfil.</p>
        </div>

        <button
          v-for="notification in sortedNotifications"
          :key="notification.id"
          type="button"
          @click="openNotification(notification)"
          :class="[
            'w-full rounded-[24px] border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm',
            getVariantClasses(notification.type).card,
            !notification.read ? 'ring-1 ring-rose-100' : ''
          ]"
        >
          <div class="flex items-start gap-3">
            <div :class="['flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', getVariantClasses(notification.type).icon]">
              <component :is="getVariantIcon(notification)" class="h-5 w-5" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-black tracking-tight text-slate-900">{{ notification.title }}</p>
                  <p class="mt-1 text-sm leading-relaxed text-slate-600">{{ notification.message }}</p>
                </div>
                <span class="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  {{ formatRelativeDate(notification.createdAt) }}
                </span>
              </div>

              <div class="mt-3 flex items-center gap-2">
                <span
                  v-if="!notification.read"
                  class="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-600"
                >
                  Novo
                </span>
                <span
                  v-if="notification.actionTab"
                  class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500"
                >
                  Abrir {{ getActionTabLabel(notification.actionTab) }}
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
