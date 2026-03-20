import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const STORAGE_KEY = 'univida_appointments';

const seedAppointments = [
  {
    id: 1,
    donorId: 1,
    campaignId: 'camp-1',
    hospital: 'Instituto Nacional de Sangue',
    date: '2026-03-15',
    time: '09:00',
    status: 'confirmado',
    notes: 'Doacao matinal agendada.'
  }
];

const normalizeAppointment = (appointment) => ({
  id: appointment?.id ?? Date.now(),
  donorId:
    appointment?.donorId === null || typeof appointment?.donorId === 'undefined'
      ? null
      : Number(appointment.donorId),
  campaignId: appointment?.campaignId ?? null,
  hospital: appointment?.hospital ?? '',
  date: appointment?.date ?? '',
  time: appointment?.time ?? '',
  status: appointment?.status ?? 'confirmado',
  notes: appointment?.notes ?? ''
});

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([...seedAppointments].map(normalizeAppointment));
  const autoOpenBooking = ref(false);

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        appointments.value = parsed.map(normalizeAppointment);
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
    const normalizedDonorId = Number(donorId);
    if (!Number.isFinite(normalizedDonorId) || !campaignId) return;
    appointments.value = appointments.value.filter((appointment) => {
      return !(Number(appointment.donorId) === normalizedDonorId && appointment.campaignId === campaignId);
    });
  };

  loadFromStorage();

  watch(
    appointments,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
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
