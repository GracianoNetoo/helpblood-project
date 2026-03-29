<script setup>
import { ref, computed, onMounted } from 'vue';
import { MapPin, CalendarDays, ArrowRight, ShieldCheck } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useAppointmentsStore } from '../stores/appointmentsStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useAuthStore } from '../stores/authStore';
import { useDonorsStore } from '../stores/donorsStore';

const appointmentsStore = useAppointmentsStore();
const campaignsStore = useCampaignsStore();
const authStore = useAuthStore();
const donorsStore = useDonorsStore();

const { appointments } = storeToRefs(appointmentsStore);
const { campaigns, autoOpenCampaign, lastSyncError } = storeToRefs(campaignsStore);
const { currentDonorId } = storeToRefs(authStore);
const { donors } = storeToRefs(donorsStore);

const selectedCampaign = ref(null);
const isConfirmOpen = ref(false);
const showToast = ref(false);

const activeCampaigns = computed(() => campaigns.value.filter((item) => item.status !== 'inativo'));
const fallbackDonor = computed(() => donors.value[0] || null);
const currentDonorIdValue = computed(() => {
  if (currentDonorId.value) return String(currentDonorId.value);
  return fallbackDonor.value?.id ? String(fallbackDonor.value.id) : null;
});

const currentDonor = computed(() => {
  if (currentDonorIdValue.value === null) return fallbackDonor.value;
  return donors.value.find((donor) => String(donor.id) === currentDonorIdValue.value) || fallbackDonor.value;
});

const scheduledCampaignIds = computed(() => {
  const ids = appointments.value
    .filter((appointment) => String(appointment.donorId) === currentDonorIdValue.value)
    .map((appointment) => appointment.campaignId)
    .filter(Boolean);
  return new Set(ids);
});

const participatedCampaignIds = computed(() => {
  const history = Array.isArray(currentDonor.value?.donationHistory) ? currentDonor.value.donationHistory : [];
  const ids = history.map((donation) => donation.campaignId).filter(Boolean);
  return new Set(ids);
});

const isScheduled = (campaignId) => scheduledCampaignIds.value.has(campaignId);
const hasParticipated = (campaignId) => participatedCampaignIds.value.has(campaignId);

const formatDateLabel = (campaign) => {
  if (!campaign.dateISO) return 'Data a definir';
  const base = new Date(`${campaign.dateISO}T${campaign.time || '00:00'}`);
  if (Number.isNaN(base.getTime())) return campaign.dateISO;
  const formatter = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short' });
  const datePart = formatter.format(base);
  const timePart = campaign.time ? campaign.time.replace(':', 'h') : 'Horario a definir';
  return `${datePart}, ${timePart}`;
};

const openConfirm = (campaign) => {
  if (isScheduled(campaign.id) || hasParticipated(campaign.id)) return;
  selectedCampaign.value = campaign;
  isConfirmOpen.value = true;
};

const closeConfirm = () => {
  isConfirmOpen.value = false;
  selectedCampaign.value = null;
};

const confirmSchedule = () => {
  if (!selectedCampaign.value) return;
  appointmentsStore.addAppointment({
    donorId: currentDonorIdValue.value,
    hospital: selectedCampaign.value.title,
    date: selectedCampaign.value.dateISO,
    time: selectedCampaign.value.time,
    notes: `Campanha em ${selectedCampaign.value.location}`,
    campaignId: selectedCampaign.value.id
  });
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2200);
  closeConfirm();
};

onMounted(() => {
  if (autoOpenCampaign.value) {
    const firstAvailable = activeCampaigns.value.find((campaign) => {
      return !isScheduled(campaign.id) && !hasParticipated(campaign.id);
    });
    if (firstAvailable) openConfirm(firstAvailable);
    campaignsStore.consumeOpenCampaign();
  }
});
</script>

<template>
  <div class="max-w-300 mx-auto pb-10">
    <div class="bg-white rounded-4xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
      <div v-if="lastSyncError" class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
        Não foi possivel sincronizar as campanhas agora. {{ lastSyncError }}
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Campanhas Ativas</h2>
          <p class="text-sm text-gray-500 mt-1">Escolha um local e agende a sua proxima doação.</p>
        </div>
      </div>

      <div v-if="activeCampaigns.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl text-sm text-gray-500">
        Sem campanhas ativas no momento.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="camp in activeCampaigns" :key="camp.id" class="group border border-gray-200 rounded-3xl p-6 bg-white hover:shadow-lg hover:border-rose-200 transition-all">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              :class="camp.highlight === 'Critico' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-700'">
              {{ camp.highlight }}
            </span>
            <div class="flex gap-1">
              <span v-for="tag in camp.tags" :key="tag" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                {{ tag }}
              </span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-lg leading-tight mb-4 group-hover:text-rose-700 transition-colors">
            {{ camp.title }}
          </h3>

          <div class="space-y-3 text-[14px] text-gray-600 font-medium">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <MapPin class="w-4 h-4" />
              </div>
              {{ camp.location }}
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <CalendarDays class="w-4 h-4" />
              </div>
              {{ formatDateLabel(camp) }}
            </div>
          </div>

          <p class="mt-4 text-[13px] text-gray-500 leading-relaxed">{{ camp.description }}</p>

          <button
            @click="openConfirm(camp)"
            :disabled="isScheduled(camp.id) || hasParticipated(camp.id)"
            class="mt-5 w-full border border-gray-200 font-bold rounded-2xl py-3 transition-all flex items-center justify-center gap-2"
            :class="hasParticipated(camp.id)
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed'
              : isScheduled(camp.id)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-900 hover:bg-gray-900 hover:text-white'"
          >
            {{ hasParticipated(camp.id) ? 'Participou nesta campanha' : isScheduled(camp.id) ? 'Agendado' : 'Agendar Horario' }}
            <ArrowRight v-if="!isScheduled(camp.id) && !hasParticipated(camp.id)" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isConfirmOpen" class="fixed inset-0 z-30 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeConfirm"></div>
    <div class="relative w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6">
      <div class="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 mb-4">
        <ShieldCheck class="w-6 h-6" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">Confirmar agendamento</h3>
      <p class="text-sm text-gray-500 mb-6">
        Deseja agendar a campanha
        <span class="font-semibold text-gray-900">{{ selectedCampaign?.title }}</span>?
      </p>
      <div class="flex gap-3">
        <button @click="closeConfirm" class="flex-1 px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 font-bold hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
        <button @click="confirmSchedule" class="flex-1 px-4 py-3 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-colors">
          Confirmar
        </button>
      </div>
    </div>
  </div>

  <div v-if="showToast" class="fixed bottom-6 right-6 z-30">
    <div class="bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      Agendamento criado com sucesso.
    </div>
  </div>
</template>
