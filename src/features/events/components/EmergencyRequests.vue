<script setup>
import { computed, ref } from 'vue';
import { AlertCircle, MapPin, Droplet, PhoneCall } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useAppointmentsStore } from '../store/appointmentsStore';
import { useHelpRequestsStore } from '../store/helpRequestsStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useDonorsStore } from '@/features/user/store/donorsStore';
import { formatEligibilityDate, getDonationEligibility } from '@/shared/utils/donationEligibility';

const appointmentsStore = useAppointmentsStore();
const helpRequestsStore = useHelpRequestsStore();
const authStore = useAuthStore();
const donorsStore = useDonorsStore();
const { requests, lastSyncError } = storeToRefs(helpRequestsStore);
const { currentDonorId, accessToken } = storeToRefs(authStore);
const { donors } = storeToRefs(donorsStore);
const showToast = ref(false);
let toastTimeoutId = null;

const approvedRequests = computed(() => requests.value.filter((item) => item.status === 'approved'));
const currentDonorIdValue = computed(() => (currentDonorId.value ? String(currentDonorId.value) : null));
const currentDonor = computed(() => {
  if (!currentDonorIdValue.value) return donors.value[0] || null;
  return donors.value.find((donor) => String(donor.id) === currentDonorIdValue.value) || donors.value[0] || null;
});
const eligibilityInfo = computed(() => getDonationEligibility(currentDonor.value));
const eligibilityBlockMessage = computed(() => {
  if (eligibilityInfo.value.isEligible) return '';
  const reason = eligibilityInfo.value.reasons[0] || 'Ainda não está elegível para doar.';
  const nextDate = eligibilityInfo.value.nextEligibleDate
    ? `Próxima data disponível: ${formatEligibilityDate(eligibilityInfo.value.nextEligibleDate)}.`
    : '';
  return [reason, nextDate].filter(Boolean).join(' ');
});

const getRequestTitle = (request) => {
  if (request?.anonimo) return 'Pedido anonimo';
  if (request?.nome) return request.nome;
  return 'Pedido sem identificacao';
};

const acceptEmergency = async (request) => {
  if (!eligibilityInfo.value.isEligible) return;
  await appointmentsStore.addAppointment(
    {
      donorId: currentDonorId.value ? String(currentDonorId.value) : null,
      hospital: request.localizacao,
      date: new Date().toISOString().split('T')[0],
      time: 'Imediato',
      notes: `Aceite Pedido de Ajuda: ${request.motivo}`,
      source: 'emergency'
    },
    { accessToken: accessToken.value }
  );
  helpRequestsStore.removeRequest(request.id);
  showToast.value = true;
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }
  toastTimeoutId = window.setTimeout(() => {
    showToast.value = false;
    toastTimeoutId = null;
  }, 2600);
};
</script>

<template>
  <div class="max-w-300 mx-auto pb-10">
    <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10">
      <div v-if="lastSyncError" class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
        Nao foi possivel sincronizar os pedidos de ajuda agora. {{ lastSyncError }}
      </div>

      <div v-if="!eligibilityInfo.isEligible" class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
        {{ eligibilityBlockMessage }}
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <span class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <AlertCircle class="w-5 h-5 text-rose-600" />
          </span>
          Pedidos de Ajuda (Emergencias)
        </h2>
        <p class="text-sm text-gray-500 mt-2">Chamadas aprovadas pelo administrador.</p>
      </div>

      <div v-if="approvedRequests.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
        <Droplet class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-gray-900">Sem pedidos ativos</h3>
        <p class="text-sm text-gray-500 mt-2">Assim que um pedido for aprovado, ele aparece aqui.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="request in approvedRequests" :key="request.id" class="relative overflow-hidden border border-rose-200 bg-rose-50/30 rounded-3xl p-6 hover:shadow-lg hover:shadow-rose-100 transition-all group">
          <div class="absolute right-0 top-0 w-32 h-32 bg-linear-to-br from-rose-200 to-transparent opacity-20 group-hover:opacity-40 rounded-bl-full transition-opacity"></div>

          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 z-10 relative">
            <div class="flex gap-5">
              <div class="w-16 h-16 bg-white border border-rose-100 rounded-[18px] flex flex-col items-center justify-center font-bold text-rose-600 shadow-sm shrink-0">
                <span class="text-xl leading-none">{{ request.tipo_sanguineo }}</span>
                <span class="text-[11px] opacity-60">{{ request.volume || 'N/A' }}</span>
              </div>
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 rounded-full text-[10px] font-bold text-white uppercase tracking-widest mb-2 shadow-sm shadow-rose-600/20">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> {{ request.urgencia }}
                </div>
                <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ getRequestTitle(request) }}</h3>
                <p class="text-sm text-gray-500 mt-1 flex items-center gap-1 font-medium">
                  <MapPin class="w-4 h-4 text-gray-400" /> {{ request.localizacao }}
                </p>
                <p class="text-sm text-gray-600 mt-3 max-w-xl">{{ request.motivo || 'Motivo nao informado.' }}</p>
                <div class="mt-4 flex items-center gap-3 text-[13px] font-semibold text-gray-500">
                  <span v-if="request.anonimo" class="text-rose-600 bg-rose-100 px-2 py-1 rounded-md">Pedido anonimo</span>
                  <span class="inline-flex items-center gap-1"><PhoneCall class="w-3.5 h-3.5" /> {{ request.contacto || 'Contacto indisponivel' }}</span>
                </div>
              </div>
            </div>

            <button
              @click="acceptEmergency(request)"
              :disabled="!eligibilityInfo.isEligible"
              class="px-5 py-2.5 rounded-2xl font-bold shadow-md transition-all text-sm shrink-0 disabled:cursor-not-allowed disabled:shadow-none"
              :class="eligibilityInfo.isEligible ? 'bg-gray-900 hover:bg-black text-white' : 'bg-amber-100 text-amber-700'"
            >
              {{ eligibilityInfo.isEligible ? 'Aceitar chamada' : eligibilityInfo.countdownLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showToast" class="fixed bottom-6 right-6 z-30 max-w-sm">
    <div class="bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      Chamada aceite com sucesso. Verifique a aba Agendamentos.
    </div>
  </div>
</template>
