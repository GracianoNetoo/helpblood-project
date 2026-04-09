import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { ensurePersistedStoreSchemaVersion } from '@/shared/utils/ensurePersistedStoreSchemaVersion';
import { notifyInfo } from '@/core/services/toastService';

const STORAGE_KEY = 'univida_notifications';
const SEEN_EVENTS_KEY = 'univida_notification_seen_events';

const normalizeNotification = (item) => ({
  id: item?.id || `notification-${Date.now()}`,
  eventKey: item?.eventKey || null,
  type: item?.type || 'info',
  title: item?.title || '',
  message: item?.message || '',
  actionTab: item?.actionTab || null,
  createdAt: item?.createdAt || new Date().toISOString(),
  read: Boolean(item?.read)
});

const formatDateTime = (value) => {
  if (!value) return 'data a definir';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(parsed);
};

const normalizeText = (value) => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const buildScheduledDate = (appointment) => {
  if (!appointment?.date) return null;
  const timeValue = appointment?.time && appointment.time !== 'Imediato' ? appointment.time : '09:00';
  const parsed = new Date(`${appointment.date}T${timeValue}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const useNotificationsStore = defineStore('notifications', () => {
  ensurePersistedStoreSchemaVersion();

  const activeRecipientId = ref(null);
  const notifications = ref([]);
  const seenEventKeys = ref([]);
  const hasCompletedInitialSync = ref(false);

  const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length);

  const getNotificationsStorageKey = () => (activeRecipientId.value ? `${STORAGE_KEY}_${activeRecipientId.value}` : STORAGE_KEY);
  const getSeenEventsStorageKey = () => (activeRecipientId.value ? `${SEEN_EVENTS_KEY}_${activeRecipientId.value}` : SEEN_EVENTS_KEY);

  const saveNotifications = (value) => {
    if (!activeRecipientId.value) return;
    try {
      localStorage.setItem(getNotificationsStorageKey(), JSON.stringify(value));
    } catch (error) {
      console.warn('Falha ao salvar notificações:', error);
    }
  };

  const saveSeenEventKeys = (value) => {
    if (!activeRecipientId.value) return;
    try {
      localStorage.setItem(getSeenEventsStorageKey(), JSON.stringify(value));
    } catch (error) {
      console.warn('Falha ao salvar eventos de notificação:', error);
    }
  };

  const loadNotifications = () => {
    if (!activeRecipientId.value) return;
    try {
      const raw = localStorage.getItem(getNotificationsStorageKey());
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        notifications.value = parsed.map(normalizeNotification);
      }
    } catch (error) {
      console.warn('Falha ao carregar notificações:', error);
    }
  };

  const loadSeenEventKeys = () => {
    if (!activeRecipientId.value) return;
    try {
      const raw = localStorage.getItem(getSeenEventsStorageKey());
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        seenEventKeys.value = parsed.map((item) => String(item));
      }
    } catch (error) {
      console.warn('Falha ao carregar eventos de notificação:', error);
    }
  };

  const pushNotification = (payload) => {
    const normalized = normalizeNotification(payload);
    if (normalized.eventKey && seenEventKeys.value.includes(normalized.eventKey)) {
      return false;
    }

    notifications.value = [normalized, ...notifications.value].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (normalized.eventKey) {
      seenEventKeys.value = [...seenEventKeys.value, normalized.eventKey];
      saveSeenEventKeys(seenEventKeys.value);
    }

    return true;
  };

  const addNotification = (payload, options = {}) => {
    const created = pushNotification(payload);
    if (!created) return false;

    if (!options.silent) {
      notifyInfo(payload.message || payload.title, {
        id: payload.eventKey ? `notification-toast-${payload.eventKey}` : undefined,
        title: payload.title || 'Nova notificação'
      });
    }

    return true;
  };

  const markAsRead = (id) => {
    notifications.value = notifications.value.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        read: true
      };
    });
  };

  const markAllAsRead = () => {
    notifications.value = notifications.value.map((item) => ({
      ...item,
      read: true
    }));
  };

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter((item) => item.id !== id);
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  const setActiveRecipient = (recipientId) => {
    const normalizedRecipientId = recipientId ? String(recipientId) : null;
    if (activeRecipientId.value === normalizedRecipientId) return;

    activeRecipientId.value = normalizedRecipientId;
    notifications.value = [];
    seenEventKeys.value = [];
    hasCompletedInitialSync.value = false;

    if (!activeRecipientId.value) return;

    loadNotifications();
    loadSeenEventKeys();
  };

  const syncNotifications = ({ donor, appointments = [], campaigns = [], helpRequests = [] } = {}) => {
    if (!donor?.id) return;

    const shouldNotifySilently = !hasCompletedInitialSync.value;
    const donorId = String(donor.id);
    const donorProvince = normalizeText(donor.provincia);
    const donorName = donor.nome || 'Doador';
    let createdCount = 0;

    helpRequests
      .filter((request) => String(request.requesterId || '') === donorId && request.status === 'approved')
      .forEach((request) => {
        const created = addNotification(
          {
            id: `help-request-approved-${request.id}`,
            eventKey: `help-request-approved-${request.id}`,
            type: 'success',
            title: 'Pedido de ajuda aprovado',
            message: `O seu pedido em ${request.localizacao || 'local não informado'} foi aprovado e está visível para os doadores.`,
            actionTab: 'emergencies',
            createdAt: request.createdAt || new Date().toISOString()
          },
          { silent: shouldNotifySilently }
        );
        if (created) createdCount += 1;
      });

    appointments
      .filter((appointment) => String(appointment.donorId || '') === donorId)
      .forEach((appointment) => {
        if (appointment.status === 'confirmado' || appointment.status === 'imediato') {
          const created = addNotification(
            {
              id: `appointment-confirmed-${appointment.id}`,
              eventKey: `appointment-confirmed-${appointment.id}`,
              type: 'success',
              title: 'Agendamento confirmado',
              message: `${appointment.hospital || 'Campanha'} ficou confirmado para ${formatDateTime(buildScheduledDate(appointment) || appointment.date)}.`,
              actionTab: 'appointments',
              createdAt: appointment.createdAt || new Date().toISOString()
            },
            { silent: shouldNotifySilently }
          );
          if (created) createdCount += 1;

          const scheduledDate = buildScheduledDate(appointment);
          if (scheduledDate) {
            const now = new Date();
            const diff = scheduledDate.getTime() - now.getTime();
            if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
              const reminderCreated = addNotification(
                {
                  id: `appointment-reminder-${appointment.id}`,
                  eventKey: `appointment-reminder-${appointment.id}`,
                  type: 'info',
                  title: 'Lembrete da campanha',
                  message: `A sua campanha ${appointment.hospital || 'agendada'} acontece em menos de 24 horas.`,
                  actionTab: 'appointments',
                  createdAt: now.toISOString()
                },
                { silent: shouldNotifySilently }
              );
              if (reminderCreated) createdCount += 1;
            }
          }
        }

        if (appointment.status === 'cancelado') {
          const created = addNotification(
            {
              id: `appointment-cancelled-${appointment.id}`,
              eventKey: `appointment-cancelled-${appointment.id}`,
              type: 'warning',
              title: 'Agendamento cancelado',
              message: `${appointment.hospital || 'A campanha'} foi cancelada e saiu da sua agenda ativa.`,
              actionTab: 'appointments',
              createdAt: appointment.updatedAt || new Date().toISOString()
            },
            { silent: shouldNotifySilently }
          );
          if (created) createdCount += 1;
        }
      });

    campaigns
      .filter((campaign) => campaign.status !== 'inativo')
      .filter((campaign) => donorProvince && normalizeText(campaign.location).includes(donorProvince))
      .forEach((campaign) => {
        const created = addNotification(
          {
            id: `campaign-province-${campaign.id}`,
            eventKey: `campaign-province-${campaign.id}`,
            type: 'info',
            title: 'Nova campanha na sua província',
            message: `${campaign.title} foi publicada para ${campaign.location}.`,
            actionTab: 'campaigns',
            createdAt: campaign.createdAt || new Date().toISOString()
          },
          { silent: shouldNotifySilently }
        );
        if (created) createdCount += 1;
      });

    const donationHistory = Array.isArray(donor.donationHistory) ? donor.donationHistory : [];
    donationHistory
      .filter((donation) => donation.recordedBy && String(donation.recordedBy) !== donorId)
      .forEach((donation) => {
        const created = addNotification(
          {
            id: `donation-registered-${donation.id}`,
            eventKey: `donation-registered-${donation.id}`,
            type: 'success',
            title: 'Doação registada pelo admin',
            message: `${donorName}, a sua doação de ${Number(donation.liters || 0).toFixed(2)} L foi registada em ${donation.campaignTitle || 'campanha sem título'}.`,
            actionTab: 'donations',
            createdAt: donation.createdAt || donation.date || new Date().toISOString()
          },
          { silent: shouldNotifySilently }
        );
        if (created) createdCount += 1;
      });

    hasCompletedInitialSync.value = true;

    if (createdCount > 1 && !shouldNotifySilently) {
      notifyInfo(`Você recebeu ${createdCount} novas notificações.`, {
        id: 'notification-batch-sync',
        title: 'Atualizações da sua conta'
      });
    }
  };

  watch(
    notifications,
    (value) => {
      saveNotifications(value);
    },
    { deep: true }
  );

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    setActiveRecipient,
    syncNotifications
  };
});
