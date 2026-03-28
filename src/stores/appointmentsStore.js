import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { resetPersistedStoreData } from './resetPersistedStoreData';

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
  notes: appointment?.notes ?? ''
});

const isSeedAppointment = (appointment) => seedAppointmentIds.has(String(appointment?.id));

export const useAppointmentsStore = defineStore('appointments', () => {
  resetPersistedStoreData();
  const appointments = ref(SHOULD_USE_SEED_APPOINTMENTS ? [...seedAppointments].map(normalizeAppointment) : []);
  const autoOpenBooking = ref(false);

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

  const addAppointment = (newAppointment) => {
    appointments.value.unshift(
      normalizeAppointment({
        id: Date.now(),
        status: 'confirmado',
        ...newAppointment
      })
    );
  };

  const cancelAppointment = (id) => {
    appointments.value = appointments.value.filter((appointment) => appointment.id !== id);
  };

  const completeCampaignForDonor = (donorId, campaignId) => {
    const normalizedDonorId = donorId ? String(donorId) : null;
    if (!normalizedDonorId || !campaignId) return;
    appointments.value = appointments.value.filter((appointment) => {
      return !(String(appointment.donorId) === normalizedDonorId && appointment.campaignId === campaignId);
    });
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
    addAppointment,
    cancelAppointment,
    completeCampaignForDonor,
    autoOpenBooking,
    requestOpenBooking,
    consumeOpenBooking
  };
});
