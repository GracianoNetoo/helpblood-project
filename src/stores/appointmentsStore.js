import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppointmentsStore = defineStore('appointments', () => {
  // Estado inicial mockado de Agendamentos Activos
  const appointments = ref([
    {
      id: 1,
      hospital: 'Instituto Nacional de Sangue',
      date: '2024-03-15',
      time: '09:00',
      status: 'confirmado',
      notes: 'Doação matinal agendada.'
    }
  ]);

  const autoOpenBooking = ref(false);

  const requestOpenBooking = () => {
    autoOpenBooking.value = true;
  };

  const consumeOpenBooking = () => {
    autoOpenBooking.value = false;
  };

  // Ação para adicionar uma nova visita/marcação
  const addAppointment = (newApt) => {
    appointments.value.unshift({
      id: Date.now(),
      status: 'confirmado',
      ...newApt
    });
  };

  // Ação para cancelar (remover simuladamente)
  const cancelAppointment = (id) => {
    appointments.value = appointments.value.filter(apt => apt.id !== id);
  };

  return { appointments, addAppointment, cancelAppointment, autoOpenBooking, requestOpenBooking, consumeOpenBooking };
});
