<script setup>
import { ref, computed } from 'vue';
import { User, Droplet, MapPin, Phone, AlertTriangle, FileText } from 'lucide-vue-next';
import { useHelpRequestsStore } from '../stores/helpRequestsStore';

const emit = defineEmits(['submitted', 'cancel']);
const helpRequestsStore = useHelpRequestsStore();

const form = ref({
  nome: '',
  tipo_sanguineo: '',
  localizacao: '',
  volume: '',
  urgencia: '',
  motivo: '',
  contacto: ''
});

const submitted = ref(false);

const isInvalid = computed(() => {
  if (!form.value.nome) return true;
  if (!form.value.tipo_sanguineo) return true;
  if (!form.value.localizacao) return true;
  if (!form.value.urgencia) return true;
  if (!form.value.motivo) return true;
  if (!form.value.contacto) return true;
  return false;
});

const handleSubmit = () => {
  submitted.value = true;
  if (isInvalid.value) return;

  helpRequestsStore.addRequest({
    nome: form.value.nome.trim(),
    tipo_sanguineo: form.value.tipo_sanguineo,
    localizacao: form.value.localizacao.trim(),
    volume: form.value.volume.trim(),
    urgencia: form.value.urgencia,
    motivo: form.value.motivo.trim(),
    contacto: form.value.contacto.trim()
  });

  emit('submitted');
  form.value = {
    nome: '',
    tipo_sanguineo: '',
    localizacao: '',
    volume: '',
    urgencia: '',
    motivo: '',
    contacto: ''
  };
  submitted.value = false;
};
</script>

<template>
  <div class="bg-white rounded-[32px] shadow-2xl border border-white/20 overflow-hidden max-w-3xl w-full">
    <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Pedido de Ajuda</h2>
        <p class="text-sm text-gray-500 mt-1">Os pedidos são anónimos e enviados para a comunidade.</p>
      </div>
      <button @click="$emit('cancel')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="p-6 md:p-8 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Nome</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User class="h-4 w-4 text-gray-400" />
            </div>
            <input v-model="form.nome" type="text" placeholder="Nome completo"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
          </div>
          <p v-if="submitted && !form.nome" class="text-[11px] text-rose-600 font-bold">Nome é obrigatório.</p>
        </div>

        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Tipo Sanguíneo</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Droplet class="h-4 w-4 text-gray-400" />
            </div>
            <select v-model="form.tipo_sanguineo"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none">
              <option value="" disabled>Selecione</option>
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
          <p v-if="submitted && !form.tipo_sanguineo" class="text-[11px] text-rose-600 font-bold">Tipo sanguíneo é obrigatório.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Localização</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin class="h-4 w-4 text-gray-400" />
            </div>
            <input v-model="form.localizacao" type="text" placeholder="Ex: Luanda - Talatona"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
          </div>
          <p v-if="submitted && !form.localizacao" class="text-[11px] text-rose-600 font-bold">Localização é obrigatória.</p>
        </div>

        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Urgência</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <AlertTriangle class="h-4 w-4 text-gray-400" />
            </div>
            <select v-model="form.urgencia"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none">
              <option value="" disabled>Selecione</option>
              <option>Alta (24h)</option>
              <option>Moderada (48h)</option>
              <option>Baixa (72h+)</option>
            </select>
          </div>
          <p v-if="submitted && !form.urgencia" class="text-[11px] text-rose-600 font-bold">Urgência é obrigatória.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Volume (Opcional)</label>
          <input v-model="form.volume" type="text" placeholder="Ex: 450 ml"
            class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
        </div>

        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Contacto</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone class="h-4 w-4 text-gray-400" />
            </div>
            <input v-model="form.contacto" type="text" placeholder="Telefone ou WhatsApp"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
          </div>
          <p v-if="submitted && !form.contacto" class="text-[11px] text-rose-600 font-bold">Contacto é obrigatório.</p>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Motivo</label>
        <div class="relative">
          <div class="absolute top-4 left-4 pointer-events-none">
            <FileText class="h-4 w-4 text-gray-400" />
          </div>
          <textarea v-model="form.motivo" rows="3" placeholder="Ex: Necessidade urgente para cirurgia"
            class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium resize-none"></textarea>
        </div>
        <p v-if="submitted && !form.motivo" class="text-[11px] text-rose-600 font-bold">Motivo é obrigatório.</p>
      </div>

      <div class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
        <button type="button" @click="$emit('cancel')" class="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-bold transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="isInvalid" class="flex-1 px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Enviar Pedido
        </button>
      </div>
    </form>
  </div>
</template>
