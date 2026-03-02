<script setup>
import { ref } from 'vue';
import { FileText, MapPin, Droplet, CalendarDays, Clock } from 'lucide-vue-next';
import { useAppointmentsStore } from '../stores/appointmentsStore';

const appointmentsStore = useAppointmentsStore();

const requests = ref([
  {
    id: 'R-1021',
    hospital: 'Instituto Nacional de Sangue',
    location: 'Luanda - Maianga',
    bloodType: 'O+',
    units: '450 ml',
    deadline: '2026-03-10',
    time: '09:30',
    reason: 'Reposição de stock semanal'
  },
  {
    id: 'R-1048',
    hospital: 'Hospital Geral de Luanda',
    location: 'Luanda - Cazenga',
    bloodType: 'A-',
    units: '450 ml',
    deadline: '2026-03-12',
    time: '14:00',
    reason: 'Cirurgias programadas'
  },
  {
    id: 'R-1102',
    hospital: 'Clínica Sagrada Esperança',
    location: 'Luanda - Ingombota',
    bloodType: 'B+',
    units: '450 ml',
    deadline: '2026-03-15',
    time: '10:15',
    reason: 'Reposição urgente'
  }
]);

const acceptRequest = (request) => {
  appointmentsStore.addAppointment({
    hospital: request.hospital,
    date: request.deadline,
    time: request.time,
    notes: `Pedido aceite: ${request.reason}`
  });

  requests.value = requests.value.filter((item) => item.id !== request.id);
  alert('Pedido aceite. Verifique a aba Agendamentos para confirmar a visita.');
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10">
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <span class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText class="w-5 h-5 text-gray-700" />
            </span>
            Pedidos de Doação
          </h2>
          <p class="text-sm text-gray-500 mt-2">Solicitações ativas de hospitais parceiros.</p>
        </div>
      </div>

      <div v-if="requests.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-[24px]">
        <Droplet class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-gray-900">Sem pedidos disponíveis</h3>
        <p class="text-sm text-gray-500 mt-2">Quando houver novas solicitações, elas aparecerão aqui.</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="request in requests"
          :key="request.id"
          class="relative overflow-hidden border border-gray-200/70 rounded-[24px] p-6 bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group"
        >
          <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-slate-900 via-slate-600 to-slate-400"></div>

          <div class="flex items-start justify-between gap-4 mb-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-[16px] bg-slate-900 text-white flex flex-col items-center justify-center font-bold shadow-md">
                <span class="text-lg leading-none">{{ request.bloodType }}</span>
                <span class="text-[11px] opacity-70">{{ request.units }}</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ request.hospital }}</h3>
                <p class="text-sm text-gray-500 mt-1 flex items-center gap-1 font-medium">
                  <MapPin class="w-4 h-4 text-gray-400" />
                  {{ request.location }}
                </p>
              </div>
            </div>
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-[11px] font-bold uppercase tracking-widest border border-slate-100">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Pedido
            </span>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-3 text-[14px] text-gray-600 font-medium">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <CalendarDays class="w-4 h-4" />
              </div>
              {{ formatDate(request.deadline) }}
            </div>
            <div class="flex items-center gap-3 text-[14px] text-gray-600 font-medium">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <Clock class="w-4 h-4" />
              </div>
              {{ request.time }}h
            </div>
          </div>

          <div class="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-4">
            <div class="text-sm text-gray-500 font-medium">
              <span class="text-gray-900 font-bold">Motivo:</span> {{ request.reason }}
            </div>
            <button
              @click="acceptRequest(request)"
              class="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl font-bold shadow-md transition-all text-sm shrink-0"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
