<script setup>
import { ref, computed, defineEmits } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';
import { useAuthStore } from '../store/authStore';
import { angolaLocations, getMunicipiosByProvincia } from '../../../shared/utils/angolaLocations';
import { normalizeAngolaPhone } from '../../../shared/utils/phone';
import { getZodFieldErrors } from '../../../shared/utils/zodErrors';
import { registerDonorSchema } from '../validation/registerSchema';

const emit = defineEmits(['sucesso']);
const authStore = useAuthStore();

const mostrarSenha = ref(false);
const mostrarSenhaConfirmacao = ref(false);
const submitted = ref(false);
const isSubmitting = ref(false);
const formError = ref('');
const signupNotice = ref('');
const touched = ref({
  nome: false,
  tipo_sanguineo: false,
  rh: false,
  doacao_sangue: false,
  provincia: false,
  municipio: false,
  telefone: false,
  email: false,
  senha: false,
  confirmar_senha: false
});

const form = ref({
  nome: '',
  tipo_sanguineo: '',
  rh: '',
  provincia: '',
  telefone: '',
  email: '',
  doacao_sangue: '',
  senha: '',
  confirmar_senha: ''
});

const provinciaSelecionada = ref('');
const municipioSelecionado = ref('');

const municipiosDisponiveis = computed(() => getMunicipiosByProvincia(provinciaSelecionada.value));

const validationInput = computed(() => ({
  nome: form.value.nome,
  tipo_sanguineo: form.value.tipo_sanguineo,
  rh: form.value.rh,
  doacao_sangue: form.value.doacao_sangue,
  provincia: provinciaSelecionada.value,
  municipio: municipioSelecionado.value,
  telefone: form.value.telefone,
  email: form.value.email,
  senha: form.value.senha,
  confirmar_senha: form.value.confirmar_senha
}));

const validationResult = computed(() => registerDonorSchema.safeParse(validationInput.value));
const fieldErrors = computed(() => getZodFieldErrors(validationResult.value));
const isFormInvalid = computed(() => !validationResult.value.success);

const aoMudarProvincia = () => {
  municipioSelecionado.value = '';
};

const hasError = (field) => Boolean((submitted.value || touched.value[field]) && fieldErrors.value[field]);
const getError = (field) => (hasError(field) ? fieldErrors.value[field] : '');

const resetForm = () => {
  form.value = {
    nome: '',
    tipo_sanguineo: '',
    rh: '',
    provincia: '',
    telefone: '',
    email: '',
    doacao_sangue: '',
    senha: '',
    confirmar_senha: ''
  };
  provinciaSelecionada.value = '';
  municipioSelecionado.value = '';
  submitted.value = false;
  touched.value = {
    nome: false,
    tipo_sanguineo: false,
    rh: false,
    doacao_sangue: false,
    provincia: false,
    municipio: false,
    telefone: false,
    email: false,
    senha: false,
    confirmar_senha: false
  };
  mostrarSenha.value = false;
  mostrarSenhaConfirmacao.value = false;
};

const handleSubmit = async () => {
  submitted.value = true;
  formError.value = '';
  signupNotice.value = '';

  if (isFormInvalid.value || isSubmitting.value) return;

  isSubmitting.value = true;

  const result = await authStore.signUpDonor({
    email: form.value.email.trim().toLowerCase(),
    password: form.value.senha,
    donorProfile: {
      nome: form.value.nome.trim(),
      tipo_sanguineo: form.value.tipo_sanguineo,
      rh: form.value.rh,
      provincia: provinciaSelecionada.value,
      municipio: municipioSelecionado.value,
      telefone: normalizeAngolaPhone(form.value.telefone),
      email: form.value.email.trim().toLowerCase(),
      doacao_sangue: form.value.doacao_sangue
    }
  });

  if (!result.ok) {
    formError.value = authStore.authError || 'Nao foi possivel concluir o cadastro.';
    isSubmitting.value = false;
    return;
  }

  resetForm();

  if (result.needsEmailConfirmation) {
    signupNotice.value = 'Conta criada com sucesso. Verifique o seu email e confirme o registo antes de iniciar sessao.';
    isSubmitting.value = false;
    return;
  }

  emit('sucesso');
  isSubmitting.value = false;
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full space-y-6 bg-white p-0 relative z-20 max-h-95 md:max-h-[65vh] overflow-y-auto px-2 pb-6 custom-scrollbar">
    <div v-if="isSubmitting" class="absolute inset-0 z-30 bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div class="bg-white border border-rose-100 shadow-xl rounded-3xl px-6 py-5 flex items-center gap-3">
        <span class="w-5 h-5 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin"></span>
        <div>
          <p class="text-sm font-bold text-gray-900">A processar cadastro</p>
          <p class="text-[12px] text-gray-500">Estamos a finalizar a sua inscricao.</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="form-control w-full space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Nome Completo</label>
        <input v-model="form.nome" @blur="touched.nome = true" type="text" placeholder="Antonio Joao Silva" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
        <p v-if="hasError('nome')" class="text-[11px] text-rose-600 font-bold">{{ getError('nome') }}</p>
      </div>

      <div class="form-control w-full space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Tipo Sanguineo</label>
        <select v-model="form.tipo_sanguineo" @blur="touched.tipo_sanguineo = true" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
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
        <p v-if="hasError('tipo_sanguineo')" class="text-[11px] text-rose-600 font-bold">{{ getError('tipo_sanguineo') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="form-control w-full space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Fator RH</label>
        <select v-model="form.rh" @blur="touched.rh = true" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
          <option value="" disabled>Selecione</option>
          <option>Positivo (+)</option>
          <option>Negativo (-)</option>
        </select>
        <p v-if="hasError('rh')" class="text-[11px] text-rose-600 font-bold">{{ getError('rh') }}</p>
      </div>

      <div class="form-control w-full space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Ja doou sangue?</label>
        <select v-model="form.doacao_sangue" @blur="touched.doacao_sangue = true" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
          <option value="" disabled>Selecione</option>
          <option>Sim, ja doei</option>
          <option>Nao, sera a 1a vez</option>
        </select>
        <p v-if="hasError('doacao_sangue')" class="text-[11px] text-rose-600 font-bold">{{ getError('doacao_sangue') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="form-control w-full space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Provincia</label>
        <select v-model="provinciaSelecionada" @change="aoMudarProvincia" @blur="touched.provincia = true" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow">
          <option value="" disabled>Selecione a provincia</option>
          <option v-for="prov in Object.keys(angolaLocations)" :key="prov">{{ prov }}</option>
        </select>
        <p v-if="hasError('provincia')" class="text-[11px] text-rose-600 font-bold">{{ getError('provincia') }}</p>
      </div>

      <div class="form-control w-full space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Municipio</label>
        <select v-model="municipioSelecionado" @blur="touched.municipio = true" :disabled="!provinciaSelecionada" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium appearance-none select-arrow disabled:opacity-50 disabled:cursor-not-allowed">
          <option value="" disabled>Defina a provincia antes</option>
          <option v-for="mun in municipiosDisponiveis" :key="mun">{{ mun }}</option>
        </select>
        <p v-if="hasError('municipio')" class="text-[11px] text-rose-600 font-bold">{{ getError('municipio') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="form-control w-full space-y-1.5 relative">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Telemovel (WhatsApp)</label>
        <input v-model="form.telefone" @blur="touched.telefone = true" type="tel" placeholder="+2449XXXXXXXX" maxlength="16" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50': hasError('telefone') }" />
        <p v-if="hasError('telefone')" class="absolute -bottom-5 text-red-500 text-[11px] ml-1 font-bold">{{ getError('telefone') }}</p>
      </div>

      <div class="form-control w-full space-y-1.5">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">E-mail</label>
        <input v-model="form.email" @blur="touched.email = true" type="email" placeholder="nome@exemplo.com" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
        <p v-if="hasError('email')" class="text-[11px] text-rose-600 font-bold">{{ getError('email') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div class="form-control w-full space-y-1.5 relative">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Palavra-passe</label>
        <input v-model="form.senha" @blur="touched.senha = true" :type="mostrarSenha ? 'text' : 'password'" placeholder="Minimo 8 caracteres" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[14px] rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
        <button type="button" @click="mostrarSenha = !mostrarSenha" class="absolute right-4 top-8.75 text-gray-400 hover:text-gray-600 transition-colors">
          <component :is="mostrarSenha ? EyeOff : Eye" class="w-5 h-5" />
        </button>
        <p v-if="hasError('senha')" class="text-[11px] text-rose-600 font-bold">{{ getError('senha') }}</p>
      </div>

      <div class="form-control w-full space-y-1.5 relative">
        <label class="label font-bold text-[13px] text-gray-700 ml-1">Confirmar Palavra-passe</label>
        <input v-model="form.confirmar_senha" @blur="touched.confirmar_senha = true" :type="mostrarSenhaConfirmacao ? 'text' : 'password'" placeholder="Repita a palavra-passe" class="w-full bg-gray-50 border text-gray-900 text-[14px] rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none transition-all font-medium placeholder:text-gray-400" :class="[hasError('confirmar_senha') ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50' : 'border-gray-200 bg-gray-50 focus:border-rose-500 focus:ring-rose-500/20 focus:ring-2']" />
        <button type="button" @click="mostrarSenhaConfirmacao = !mostrarSenhaConfirmacao" class="absolute right-4 top-8.75 text-gray-400 hover:text-gray-600 transition-colors">
          <component :is="mostrarSenhaConfirmacao ? EyeOff : Eye" class="w-5 h-5" />
        </button>
        <p v-if="hasError('confirmar_senha')" class="text-[11px] text-rose-600 font-bold">{{ getError('confirmar_senha') }}</p>
      </div>
    </div>

    <div v-if="signupNotice" class="rounded-[28px] border border-rose-200 bg-linear-to-r from-rose-50 via-white to-rose-50 px-5 py-5 shadow-[0_12px_30px_rgba(14,165,233,0.08)]">
      <div class="flex items-start gap-3">
        <div class="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-[0_10px_20px_rgba(225,29,72,0.25)]">
          <span class="text-lg font-black">!</span>
        </div>
        <div>
          <p class="text-[12px] font-black uppercase tracking-[0.18em] text-rose-700">Verificacao necessaria</p>
          <p class="mt-2 text-[14px] font-semibold leading-relaxed text-slate-700">
            {{ signupNotice }}
          </p>
          <p class="mt-2 text-[12px] text-slate-500">
            Se nao encontrar a mensagem, veja tambem a pasta de spam ou promocoes.
          </p>
        </div>
      </div>
    </div>

    <p v-if="formError" class="text-[12px] font-bold text-rose-600">
      {{ formError }}
    </p>

    <div class="pt-4">
      <button type="submit" :disabled="isFormInvalid || isSubmitting" class="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-2xl px-6 py-4 font-extrabold text-[15px] shadow-[0_8px_20px_rgba(225,29,72,0.2)] transition-all hover:-translate-y-0.5 mt-2 flex justify-center items-center gap-2 group tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
        <span v-if="isSubmitting" class="inline-flex items-center gap-2">
          <span class="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
          A processar...
        </span>
        <span v-else>Finalizar Registo</span>
      </button>
      <p class="text-center text-[12px] text-gray-500 font-medium mt-4">
        Ao registrar-se, concorda com as <a href="#" class="text-rose-600 hover:underline">Politicas de Privacidade.</a>
      </p>
    </div>
  </form>
</template>

<style scoped>
.select-arrow {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>
