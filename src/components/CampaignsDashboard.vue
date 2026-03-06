<script setup>
import { ref } from 'vue';
import { MapPin, CalendarDays, ArrowRight, ShieldCheck } from 'lucide-vue-next';
import { useAppointmentsStore } from '../stores/appointmentsStore';

const appointmentsStore = useAppointmentsStore();
const selectedCampaign = ref(null);
const isConfirmOpen = ref(false);

const campaigns = [
  {
    id: 'camp-1',
    title: 'Mutirão Nacional: Universidade Agostinho Neto',
    location: 'Luanda',
    dateLabel: 'Hoje, 10h - 15h',
    dateISO: new Date().toISOString().split('T')[0],
    time: '10:00',
    description: 'Unidade móvel em frente à reitoria, com foco na reposição urgente do banco de sangue central.',
    tags: ['O-', 'A+'],
    highlight: 'Crítico'
  },
  {
    id: 'camp-2',
    title: 'Ação Comunitária Praia Morena',
    location: 'Benguela',
    dateLabel: 'Próx Sáb, 08h',
    dateISO: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '08:00',
    description: 'Postos de triagem e coleta com apoio de voluntários locais e parceiros comunitários.',
    tags: ['Todos'],
    highlight: 'Aberto'
  },
  {
    id: 'camp-3',
    title: 'Campanha Solidária Kilamba',
    location: 'Luanda',
    dateLabel: 'Dom, 09h',
    dateISO: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00',
    description: 'Coleta organizada para famílias da região, com prioridade para doadores regulares.',
    tags: ['O+', 'B+'],
    highlight: 'Disponível'
  }
];

const openConfirm = (campaign) => {
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
    hospital: selectedCampaign.value.title,
    date: selectedCampaign.value.dateISO,
    time: selectedCampaign.value.time,
    notes: `Campanha em ${selectedCampaign.value.location}`
  });
  closeConfirm();
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Campanhas Ativas</h2>
          <p class="text-sm text-gray-500 mt-1">Escolha um local e agende a sua próxima doação.</p>
        </div>
        <button class="bg-gray-900 hover:bg-black text-white px-5 py-3 md:py-2.5 rounded-2xl font-bold shadow-md transition-all text-sm">
          Ver Mapa
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="camp in campaigns" :key="camp.id" class="group border border-gray-200 rounded-[24px] p-6 bg-white hover:shadow-lg hover:border-rose-200 transition-all">
          <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              :class="camp.highlight === 'Crítico' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-700'">
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
              {{ camp.dateLabel }}
            </div>
          </div>

          <p class="mt-4 text-[13px] text-gray-500 leading-relaxed">{{ camp.description }}</p>

          <button @click="openConfirm(camp)" class="mt-5 w-full bg-white border border-gray-200 text-gray-900 font-bold rounded-[16px] py-3 hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2">
            Agendar Horário
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isConfirmOpen" class="fixed inset-0 z-30 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="closeConfirm"></div>
    <div class="relative w-full max-w-md bg-white rounded-[24px] border border-gray-100 shadow-2xl p-6">
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
</template>
