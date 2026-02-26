<script setup>
import { ref } from 'vue';
import { Plus, MapPin, Calendar, Clock, AlertCircle } from 'lucide-vue-next';

// Controlo do modal de nova marcação
const isBookingModalOpen = ref(false);

// Lista inicial de Agendamentos Fictícios
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

// Modelo de Dados para o Formulário do Modal
const formData = ref({
  hospital: '',
  date: '',
  time: '',
  notes: ''
});

// Hospitais Disponíveis (Mock)
const hospitais = [
  'Instituto Nacional de Sangue',
  'Hospital Geral de Luanda',
  'Clínica Sagrada Esperança',
  'Hospital Maria Pia',
  'Clínica Girassol'
];

const openBookingModal = () => {
  isBookingModalOpen.value = true;
  document.body.style.overflow = 'hidden'; // Bloquear fundo
};

const closeBookingModal = () => {
  isBookingModalOpen.value = false;
  document.body.style.overflow = '';
  // Limpar form
  formData.value = { hospital: '', date: '', time: '', notes: '' };
};

const handleBookingSubmit = () => {
  // Simular adição à lista local reativa
  appointments.value.unshift({
    id: Date.now(),
    hospital: formData.value.hospital,
    date: formData.value.date,
    time: formData.value.time,
    status: 'confirmado',
    notes: formData.value.notes
  });
  
  closeBookingModal();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 md:p-10 relative">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Meus Agendamentos</h2>
          <p class="text-sm text-gray-500 mt-1">Faça a gestão das suas idas aos postos de Saúde.</p>
        </div>
        <button @click="openBookingModal" class="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 md:py-2.5 rounded-2xl font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 text-sm w-full md:w-auto">
          <Plus class="w-4 h-4" stroke-width="2.5" />
          Nova Marcação
        </button>
      </div>

      <!-- Grid de Agendamentos Activos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Estado Vazio se Array estiver vazio -->
        <div v-if="appointments.length === 0" class="col-span-full py-16 text-center border-2 border-dashed border-gray-100 rounded-[24px]">
          <Calendar class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-bold text-gray-900">Nenhuma visita agendada</h3>
          <p class="text-sm text-gray-500 mt-2">Use o botão Nova Marcação para planear a sua próxima doação.</p>
        </div>

        <!-- Cartões Fictícios / Dinâmicos de Agendamentos -->
        <div v-for="apt in appointments" :key="apt.id" class="group relative overflow-hidden bg-white border border-gray-200 hover:border-rose-200 rounded-[24px] p-6 hover:shadow-xl hover:shadow-rose-100 transition-all">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-rose-400 to-orange-300"></div>
          
          <div class="flex justify-between items-start mb-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold uppercase tracking-widest border border-emerald-100">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {{ apt.status }}
            </span>
            <button class="text-gray-400 hover:text-rose-600 text-sm font-bold transition-colors">Cancelar</button>
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
              {{ apt.time }}h
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Modal Nova Marcação -->
  <div v-if="isBookingModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <!-- Fundo Esbatido (Backdrop) -->
    <div @click="closeBookingModal" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"></div>
    
    <!-- Caixa do Formulário -->
    <div class="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-white/20 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
      
      <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
        <div>
          <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">Agendar Doação</h2>
          <p class="text-sm text-gray-500 mt-1">Preencha os dados da sua visita.</p>
        </div>
        <button @click="closeBookingModal" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <form @submit.prevent="handleBookingSubmit" class="space-y-6">
          
          <!-- Hospital Select -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">Hospital ou Clínica</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin class="h-5 w-5 text-gray-400" />
              </div>
              <select required v-model="formData.hospital" class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-2xl outline-none transition-all font-medium text-gray-900 appearance-none">
                <option value="" disabled selected>Selecione um local</option>
                <option v-for="hosp in hospitais" :key="hosp" :value="hosp">{{ hosp }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Selector Data -->
            <div>
              <label class="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">Data</label>
              <input type="date" required v-model="formData.date" class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-2xl outline-none transition-all font-medium text-gray-900" />
            </div>
            <!-- Selector Hora -->
            <div>
              <label class="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2">Hora</label>
              <input type="time" required v-model="formData.time" class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-2xl outline-none transition-all font-medium text-gray-900" />
            </div>
          </div>

          <!-- Notes Textarea -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-2 items-center gap-2">Notas Adicionais <span class="text-gray-400 font-normal lowercase tracking-normal">(Opcional)</span></label>
            <textarea v-model="formData.notes" rows="3" placeholder="Ex: Sou dador frequente, tenho preferência por atendimento matinal." class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 rounded-2xl outline-none transition-all font-medium text-gray-900 resize-none"></textarea>
          </div>

          <!-- Alert Contexto -->
          <div class="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
            <AlertCircle class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p class="text-[13px] text-blue-800 font-medium leading-relaxed">Não coma alimentos pesados ou gordurosos 4 horas antes de doar. Lembre-se de levar o seu Cartão Digital a ser apresentado na receção do hospital.</p>
          </div>

          <div class="pt-4 border-t border-gray-100 flex gap-3">
            <button type="button" @click="closeBookingModal" class="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-bold transition-colors">
              Cancelar
            </button>
            <button type="submit" class="flex-1 px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02]">
              Confirmar Reserva
            </button>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>
