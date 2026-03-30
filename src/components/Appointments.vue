<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import { Plus, Calendar, Clock } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useAppointmentsStore } from '../features/events/store/appointmentsStore';
import { useAuthStore } from '../features/auth/store/authStore';
import { useDonorsStore } from '../features/user/store/donorsStore';

const emit = defineEmits(['open-campaigns']);

const appointmentsStore = useAppointmentsStore();
const authStore = useAuthStore();
const donorsStore = useDonorsStore();

const { appointments, autoOpenBooking } = storeToRefs(appointmentsStore);
const { currentDonorId } = storeToRefs(authStore);
const { donors } = storeToRefs(donorsStore);

const fallbackDonor = computed(() => donors.value[0] || null);
const currentDonorIdValue = computed(() => {
  if (currentDonorId.value) return String(currentDonorId.value);
  return fallbackDonor.value?.id ? String(fallbackDonor.value.id) : null;
});

const scheduledCampaigns = computed(() =>
  appointments.value.filter((appointment) => {
    if (!appointment.campaignId) return false;
    if (currentDonorIdValue.value === null) return true;
    return String(appointment.donorId) === currentDonorIdValue.value;
  })
);

const openCampaigns = () => {
  emit('open-campaigns', { autoOpenCampaign: true });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
};

const shouldAppendHourSuffix = (timeValue) => {
  if (!timeValue) return false;
  return /^\d/.test(timeValue);
};

onUnmounted(() => {
  document.body.style.overflow = '';
});

onMounted(() => {
  if (autoOpenBooking.value) {
    openCampaigns();
    appointmentsStore.consumeOpenBooking();
  }
});
</script>

<template>
  <div class="max-w-300 mx-auto pb-10">
    <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10 relative">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Meus Agendamentos</h2>
          <p class="text-sm text-gray-500 mt-1">Faça a gestão das suas idas aos postos de Saúde.</p>
        </div>
        <button @click="openCampaigns" class="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 md:py-2.5 rounded-2xl font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 text-sm w-full md:w-auto">
          <Plus class="w-4 h-4" stroke-width="2.5" />
          Ver Campanhas
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="scheduledCampaigns.length === 0" class="col-span-full py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
          <Calendar class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-bold text-gray-900">Sem agendamentos marcados</h3>
          <p class="text-sm text-gray-500 mt-2">Se a sua doação já foi confirmada pelo admin, a campanha sai automaticamente desta lista.</p>
        </div>

        <div v-for="apt in scheduledCampaigns" :key="apt.id" class="group relative overflow-hidden bg-white border border-gray-200 hover:border-rose-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-rose-100 transition-all">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-rose-400 to-orange-300"></div>

          <div class="flex justify-between items-start mb-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold uppercase tracking-widest border border-emerald-100">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {{ apt.status }}
            </span>
            <button @click="appointmentsStore.cancelAppointment(apt.id)" class="text-gray-400 hover:text-rose-600 text-sm font-bold transition-colors">Cancelar</button>
          </div>

          <h3 class="font-bold text-gray-900 text-lg leading-tight mb-4 group-hover:text-rose-700 transition-colors">{{ apt.hospital }}</h3>

          <div class="space-y-3">
            <div class="flex items-center gap-3 text-[14px] text-gray-600 font-medium">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <Calendar class="w-4 h-4" />
              </div>
              {{ formatDate(apt.date) }}
            </div>
            <div class="flex items-center gap-3 text-[14px] text-gray-600 font-medium">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <Clock class="w-4 h-4" />
              </div>
              {{ apt.time }}<span v-if="shouldAppendHourSuffix(apt.time)">h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
