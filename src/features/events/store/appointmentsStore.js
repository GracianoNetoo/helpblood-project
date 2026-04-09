import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import {
  createAppointmentRow,
  isSupabaseConfigured,
  listAppointmentRows,
  updateAppointmentRow
} from '../api';
import { ensurePersistedStoreSchemaVersion } from '@/shared/utils/ensurePersistedStoreSchemaVersion';
import { notifyError } from '@/core/services/toastService';

const STORAGE_KEY = 'univida_appointments';
const SHOULD_USE_SEED_APPOINTMENTS = import.meta.env.DEV;

const seedAppointments = [];

const seedAppointmentIds = new Set(seedAppointments.map((appointment) => String(appointment.id)));

const normalizeAppointment = (appointment) => ({
  id: appointment?.id ?? Date.now(),
  donorId:
    appointment?.donorId === null || typeof appointment?.donorId === 'undefined'
      ? null
      : String(appointment.donorId),
  campaignId: appointment?.campaignId ?? null,
  hospital: appointment?.hospital ?? '',
  date: appointment?.date ?? '',
  time: appointment?.time ?? '',
  status: appointment?.status ?? 'confirmado',
  source: appointment?.source ?? 'campaign',
  notes: appointment?.notes ?? ''
});

const isSeedAppointment = (appointment) => seedAppointmentIds.has(String(appointment?.id));

const mapAppointmentFromDb = (row) => normalizeAppointment({
  id: row?.id,
  donorId: row?.donor_id,
  campaignId: row?.campaign_id,
  hospital: row?.hospital_name,
  date: row?.scheduled_date,
  time: row?.scheduled_time,
  status: row?.status,
  source: row?.source,
  notes: row?.notes
});

const mapAppointmentToDb = (appointment) => ({
  donor_id: appointment.donorId,
  campaign_id: appointment.campaignId || null,
  hospital_name: appointment.hospital,
  scheduled_date: appointment.date,
  scheduled_time: appointment.time && appointment.time !== 'Imediato' ? appointment.time : null,
  status: appointment.status || 'confirmado',
  source: appointment.source || 'campaign',
  notes: appointment.notes || null
});

const reportAppointmentError = (message, id, title = 'Falha ao sincronizar agendamentos') => {
  notifyError(message, { id: `appointments-${id}`, title });
};

export const useAppointmentsStore = defineStore('appointments', () => {
  ensurePersistedStoreSchemaVersion();
  const appointments = ref(SHOULD_USE_SEED_APPOINTMENTS ? [...seedAppointments].map(normalizeAppointment) : []);
  const autoOpenBooking = ref(false);
  const lastSyncError = ref('');

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed.map(normalizeAppointment);
        appointments.value = SHOULD_USE_SEED_APPOINTMENTS ? normalized : normalized.filter((item) => !isSeedAppointment(item));
      }
    } catch (error) {
      console.warn('Falha ao carregar agendamentos:', error);
    }
  };

  const requestOpenBooking = () => {
    autoOpenBooking.value = true;
  };

  const consumeOpenBooking = () => {
    autoOpenBooking.value = false;
  };

  const upsertAppointment = (appointment) => {
    const normalized = normalizeAppointment(appointment);
    const index = appointments.value.findIndex((item) => String(item.id) === String(normalized.id));
    if (index === -1) {
      appointments.value.unshift(normalized);
    } else {
      appointments.value[index] = normalized;
    }
    return normalized;
  };

  const refreshAppointmentsForDonor = async (donorId, accessToken = null) => {
    if (!isSupabaseConfigured || !donorId || !accessToken) return appointments.value;
    try {
      const rows = await listAppointmentRows(
        { donor_id: `eq.${donorId}` },
        { accessToken }
      );
      const remoteAppointments = Array.isArray(rows) ? rows.map(mapAppointmentFromDb) : [];
      const remoteIds = new Set(remoteAppointments.map((item) => String(item.id)));
      const localOnly = appointments.value.filter((item) => {
        return String(item.donorId) === String(donorId)
          && String(item.id).startsWith('local-')
          && !remoteIds.has(String(item.id));
      });
      const otherDonors = appointments.value.filter((item) => String(item.donorId) !== String(donorId));
      appointments.value = [...remoteAppointments, ...localOnly, ...otherDonors];
      lastSyncError.value = '';
      return appointments.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao sincronizar agendamentos.';
      reportAppointmentError(lastSyncError.value, 'refresh-donor');
      console.warn('Falha ao carregar agendamentos do doador:', error);
      return appointments.value;
    }
  };

  const refreshAllAppointments = async (accessToken = null) => {
    if (!isSupabaseConfigured || !accessToken) return appointments.value;
    try {
      const rows = await listAppointmentRows({}, { accessToken });
      const remoteAppointments = Array.isArray(rows) ? rows.map(mapAppointmentFromDb) : [];
      const remoteIds = new Set(remoteAppointments.map((item) => String(item.id)));
      const localOnly = appointments.value.filter((item) => String(item.id).startsWith('local-') && !remoteIds.has(String(item.id)));
      appointments.value = [...remoteAppointments, ...localOnly];
      lastSyncError.value = '';
      return appointments.value;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao carregar base de agendamentos.';
      reportAppointmentError(lastSyncError.value, 'refresh-all');
      console.warn('Falha ao carregar todos os agendamentos:', error);
      return appointments.value;
    }
  };

  const addAppointment = async (newAppointment, options = {}) => {
    const localAppointment = upsertAppointment({
      id: `local-${Date.now()}`,
      status: 'confirmado',
      ...newAppointment
    });

    const { accessToken = null } = options;
    if (!isSupabaseConfigured || !accessToken || !localAppointment.donorId) {
      return localAppointment;
    }

    try {
      const rows = await createAppointmentRow(mapAppointmentToDb(localAppointment), { accessToken });
      const created = Array.isArray(rows) ? rows[0] : null;
      if (created) {
        const normalized = mapAppointmentFromDb(created);
        appointments.value = appointments.value.filter((item) => String(item.id) !== String(localAppointment.id));
        upsertAppointment(normalized);
        lastSyncError.value = '';
        return normalized;
      }
      return localAppointment;
    } catch (error) {
      lastSyncError.value = error.message || 'Falha ao guardar agendamento no Supabase.';
      reportAppointmentError(lastSyncError.value, 'create', 'Falha ao guardar agendamento');
      console.warn('Falha ao criar agendamento no Supabase:', error);
      return localAppointment;
    }
  };

  const cancelAppointment = async (id, options = {}) => {
    const target = appointments.value.find((appointment) => String(appointment.id) === String(id));
    if (!target) return;

    const previousStatus = target.status;
    target.status = 'cancelado';

    const { accessToken = null } = options;
    if (!isSupabaseConfigured || !accessToken || String(id).startsWith('local-')) return;

    try {
      await updateAppointmentRow(id, { status: 'cancelado' }, { accessToken });
      lastSyncError.value = '';
    } catch (error) {
      target.status = previousStatus;
      lastSyncError.value = error.message || 'Falha ao cancelar agendamento no Supabase.';
      reportAppointmentError(lastSyncError.value, 'cancel', 'Falha ao cancelar agendamento');
      console.warn('Falha ao remover agendamento no Supabase:', error);
    }
  };

  const completeCampaignForDonor = async (donorId, campaignId, options = {}) => {
    const normalizedDonorId = donorId ? String(donorId) : null;
    if (!normalizedDonorId || !campaignId) return;

    appointments.value = appointments.value.map((appointment) => {
      if (String(appointment.donorId) !== normalizedDonorId) return appointment;
      if (appointment.campaignId !== campaignId) return appointment;
      if (appointment.status === 'cancelado' || appointment.status === 'concluido') return appointment;
      return {
        ...appointment,
        status: 'concluido'
      };
    });

    const { accessToken = null, scope = 'donor' } = options;
    if (!isSupabaseConfigured || !accessToken) return;
    if (scope === 'admin') {
      await refreshAllAppointments(accessToken);
      return;
    }
    await refreshAppointmentsForDonor(normalizedDonorId, accessToken);
  };

  loadFromStorage();

  watch(
    appointments,
    (value) => {
      try {
        const sanitizedValue = SHOULD_USE_SEED_APPOINTMENTS ? value : value.filter((item) => !isSeedAppointment(item));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedValue));
      } catch (error) {
        console.warn('Falha ao salvar agendamentos:', error);
      }
    },
    { deep: true }
  );

  return {
    appointments,
    lastSyncError,
    addAppointment,
    cancelAppointment,
    completeCampaignForDonor,
    refreshAppointmentsForDonor,
    refreshAllAppointments,
    autoOpenBooking,
    requestOpenBooking,
    consumeOpenBooking
  };
});
