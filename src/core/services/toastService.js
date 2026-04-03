import { readonly, ref } from 'vue';

const toasts = ref([]);
const toastTimers = new Map();

const clearToastTimer = (id) => {
  const existingTimer = toastTimers.get(id);
  if (!existingTimer) return;
  clearTimeout(existingTimer);
  toastTimers.delete(id);
};

const scheduleRemoval = (id, duration) => {
  if (!duration || duration <= 0) return;
  clearToastTimer(id);
  const timerId = window.setTimeout(() => {
    dismissToast(id);
  }, duration);
  toastTimers.set(id, timerId);
};

export const dismissToast = (id) => {
  clearToastTimer(id);
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};

export const showToast = ({
  id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type = 'info',
  title = '',
  message = '',
  duration = 5000
}) => {
  const normalizedMessage = String(message || '').trim();
  const normalizedTitle = String(title || '').trim();
  if (!normalizedMessage && !normalizedTitle) return null;

  const toast = {
    id,
    type,
    title: normalizedTitle,
    message: normalizedMessage,
    duration
  };

  const currentIndex = toasts.value.findIndex((item) => item.id === id);
  if (currentIndex >= 0) {
    toasts.value.splice(currentIndex, 1, toast);
  } else {
    toasts.value = [...toasts.value, toast];
  }

  scheduleRemoval(id, duration);
  return id;
};

export const notifyError = (message, options = {}) => {
  return showToast({
    type: 'error',
    title: options.title || 'Nao foi possivel concluir a operacao',
    duration: options.duration ?? 6500,
    ...options,
    message
  });
};

export const notifySuccess = (message, options = {}) => {
  return showToast({
    type: 'success',
    title: options.title || 'Tudo certo',
    duration: options.duration ?? 4000,
    ...options,
    message
  });
};

export const notifyInfo = (message, options = {}) => {
  return showToast({
    type: 'info',
    title: options.title || 'Aviso',
    duration: options.duration ?? 4500,
    ...options,
    message
  });
};

export const useToastState = () => {
  return {
    toasts: readonly(toasts)
  };
};
