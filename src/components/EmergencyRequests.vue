<script setup>
import { AlertCircle, MapPin, Droplet, PhoneCall } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useAppointmentsStore } from '../stores/appointmentsStore';
import { useHelpRequestsStore } from '../stores/helpRequestsStore';

const appointmentsStore = useAppointmentsStore();
const helpRequestsStore = useHelpRequestsStore();
const { requests } = storeToRefs(helpRequestsStore);

const acceptEmergency = (request) => {
  appointmentsStore.addAppointment({
    hospital: request.localizacao,
    date: new Date().toISOString().split('T')[0], // Hoje
    time: 'Imediato',
    notes: `Aceite Pedido de Ajuda: ${request.motivo}`
  });
  helpRequestsStore.removeRequest(request.id);
  alert('Obrigado! Chamada de Emergência aceite. Verifique a aba Agendamentos.');
};
</script>

<template>
  <div class="max-w-[1200px] mx-auto pb-10">
    <div class="bg-white rounded-[32px] border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10">
      
      <div class="mb-8">
        <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          <span class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <AlertCircle class="w-5 h-5 text-rose-600" />
          </span>
          Pedidos de Ajuda (Emergências)
        </h2>
        <p class="text-sm text-gray-500 mt-2">Chamadas de urgência alinhadas com o seu tipo sanguíneo.</p>
      </div>

      <div v-if="requests.length === 0" class="py-16 text-center border-2 border-dashed border-gray-100 rounded-[24px]">
        <Droplet class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-gray-900">Sem pedidos ativos</h3>
        <p class="text-sm text-gray-500 mt-2">Quando alguém solicitar ajuda, ela aparecerá aqui.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="request in requests" :key="request.id" class="relative overflow-hidden border border-rose-200 bg-rose-50/30 rounded-[24px] p-6 hover:shadow-lg hover:shadow-rose-100 transition-all group">
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
                <h3 class="text-lg font-bold text-gray-900 leading-tight">{{ request.nome }}</h3>
                <p class="text-sm text-gray-500 mt-1 flex items-center gap-1 font-medium">
                  <MapPin class="w-4 h-4 text-gray-400" /> {{ request.localizacao }}
                </p>
                <p class="text-sm text-gray-600 mt-3 max-w-xl">{{ request.motivo || 'Motivo não informado.' }}</p>
                <div class="mt-4 flex items-center gap-3 text-[13px] font-semibold text-gray-500">
                  <span class="text-rose-600 bg-rose-100 px-2 py-1 rounded-md">Pedido anónimo</span>
                  <span class="inline-flex items-center gap-1"><PhoneCall class="w-3.5 h-3.5" /> {{ request.contacto || 'Contacto indisponível' }}</span>
                </div>
              </div>
            </div>
            
            <button @click="acceptEmergency(request)" class="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-2xl font-bold shadow-md transition-all text-sm shrink-0">
              Aceitar Chamada
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>
