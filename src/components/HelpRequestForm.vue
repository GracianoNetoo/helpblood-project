<script setup>
import { ref, computed } from 'vue';
import { User, Droplet, MapPin, Phone, AlertTriangle, FileText } from 'lucide-vue-next';
import { useHelpRequestsStore } from '../stores/helpRequestsStore';

const emit = defineEmits(['submitted', 'cancel']);
const helpRequestsStore = useHelpRequestsStore();

const createInitialForm = () => ({
  anonimo: false,
  nome: '',
  tipo_sanguineo: '',
  localizacao: '',
  volume: '',
  urgencia: '',
  motivo: '',
  contacto: ''
});

const form = ref(createInitialForm());
const submitted = ref(false);
const showSuccess = ref(false);

const telefoneInvalido = computed(() => {
  const value = form.value.contacto.trim();
  if (!value) return false;
  const digits = value.replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 9) return true;
  return !/^[+\d][\d\s()-]+$/.test(value);
});

const excedeuLimite = computed(() => {
  return (
    form.value.nome.length > 80 ||
    form.value.localizacao.length > 80 ||
    form.value.volume.length > 20 ||
    form.value.motivo.length > 200 ||
    form.value.contacto.length > 20
  );
});

const isInvalid = computed(() => {
  if (!form.value.anonimo && !form.value.nome.trim()) return true;
  if (!form.value.tipo_sanguineo) return true;
  if (!form.value.localizacao.trim()) return true;
  if (!form.value.urgencia) return true;
  if (!form.value.motivo.trim()) return true;
  if (!form.value.contacto.trim()) return true;
  if (telefoneInvalido.value) return true;
  if (excedeuLimite.value) return true;
  return false;
});

const handleSubmit = () => {
  submitted.value = true;
  if (isInvalid.value) return;

  helpRequestsStore.addRequest({
    anonimo: form.value.anonimo,
    nome: form.value.anonimo ? '' : form.value.nome.trim(),
    tipo_sanguineo: form.value.tipo_sanguineo,
    localizacao: form.value.localizacao.trim(),
    volume: form.value.volume.trim(),
    urgencia: form.value.urgencia,
    motivo: form.value.motivo.trim(),
    contacto: form.value.contacto.trim()
  });

  emit('submitted');
  form.value = createInitialForm();
  submitted.value = false;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 2500);
};
</script>

<template>
  <div class="bg-white rounded-4xl pt-15 shadow-2xl border border-white/20 overflow-hidden max-w-3xl w-full">
    <div class="p-6 md:p-8 border-b pt-5 border-gray-100 bg-gray-50/60 flex justify-between items-center">
      <div>
        <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Pedido de Ajuda</h2>
        <p class="text-sm text-gray-500 mt-1">Pode enviar o pedido com identificacao ou de forma anonima.</p>
      </div>
      <button @click="$emit('cancel')" class="w-10 h-10 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full flex items-center justify-center transition-colors shadow-sm">
        <span class="text-xl leading-none">X</span>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="p-6 md:p-8 space-y-6">
      <label class="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-4">
        <input v-model="form.anonimo" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
        <div>
          <div class="text-sm font-bold text-gray-900">Pedido anonimo</div>
          <p class="text-[12px] text-gray-600 mt-1">Ao ativar esta opcao, o nome deixa de ser obrigatorio e o pedido aparece sem identificacao.</p>
        </div>
      </label>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div v-if="!form.anonimo" class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Nome</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User class="h-4 w-4 text-gray-400" />
            </div>
            <input v-model="form.nome" type="text" maxlength="80" placeholder="Nome completo"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
          </div>
          <div class="flex items-center justify-between">
            <p v-if="submitted && !form.nome.trim()" class="text-[11px] text-rose-600 font-bold">Nome e obrigatorio.</p>
            <p class="text-[11px] text-gray-400 font-semibold ml-auto">{{ form.nome.length }}/80</p>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Tipo Sanguineo</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Droplet class="h-4 w-4 text-gray-400" />
            </div>
            <select v-model="form.tipo_sanguineo"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none">
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
          <p v-if="submitted && !form.tipo_sanguineo" class="text-[11px] text-rose-600 font-bold">Tipo sanguineo e obrigatorio.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Localizacao</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin class="h-4 w-4 text-gray-400" />
            </div>
            <input v-model="form.localizacao" type="text" maxlength="80" placeholder="Ex: Luanda - Talatona"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
          </div>
          <div class="flex items-center justify-between">
            <p v-if="submitted && !form.localizacao.trim()" class="text-[11px] text-rose-600 font-bold">Localizacao e obrigatoria.</p>
            <p class="text-[11px] text-gray-400 font-semibold ml-auto">{{ form.localizacao.length }}/80</p>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Urgencia</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <AlertTriangle class="h-4 w-4 text-gray-400" />
            </div>
            <select v-model="form.urgencia"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none">
              <option value="" disabled>Selecione</option>
              <option>Alta (24h)</option>
              <option>Moderada (48h)</option>
              <option>Baixa (72h+)</option>
            </select>
          </div>
          <p v-if="submitted && !form.urgencia" class="text-[11px] text-rose-600 font-bold">Urgencia e obrigatoria.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Volume (Opcional)</label>
          <input v-model="form.volume" type="text" maxlength="20" placeholder="Ex: 450 ml"
            class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
          <p class="text-[11px] text-gray-400 font-semibold text-right">{{ form.volume.length }}/20</p>
        </div>

        <div class="space-y-1.5">
          <label class="label font-bold text-[13px] text-gray-700 ml-1">Contacto</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone class="h-4 w-4 text-gray-400" />
            </div>
            <input v-model="form.contacto" type="text" maxlength="9" placeholder="Telefone ou WhatsApp"
              class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium" />
          </div>
          <div class="flex items-center justify-between">
            <p v-if="submitted && !form.contacto.trim()" class="text-[11px] text-rose-600 font-bold">Contacto e obrigatorio.</p>
            <p v-else-if="telefoneInvalido" class="text-[11px] text-rose-600 font-bold">Contacto invalido.</p>
            <p class="text-[11px] text-gray-400 font-semibold ml-auto">{{ form.contacto.length }}/9</p>
          </div>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Motivo</label>
        <div class="relative">
          <div class="absolute top-4 left-4 pointer-events-none">
            <FileText class="h-4 w-4 text-gray-400" />
          </div>
          <textarea v-model="form.motivo" rows="3" maxlength="200" placeholder="Ex: Necessidade urgente para cirurgia"
            class="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium resize-none"></textarea>
        </div>
        <div class="flex items-center justify-between">
          <p v-if="submitted && !form.motivo.trim()" class="text-[11px] text-rose-600 font-bold">Motivo e obrigatorio.</p>
          <p class="text-[11px] text-gray-400 font-semibold ml-auto">{{ form.motivo.length }}/200</p>
        </div>
      </div>

      <div v-if="showSuccess" class="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl text-[13px] font-semibold">
        Pedido enviado com sucesso. Obrigado pela confianca.
      </div>

      <div class="border-t border-gray-100 flex flex-col sm:flex-row gap-3">
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
