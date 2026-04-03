<script setup>
import { computed, ref, watch } from 'vue';
import { AlertTriangle, Mail, MapPin, Phone, ShieldCheck, X } from 'lucide-vue-next';
import { useAuthStore } from '../../auth/store/authStore';
import { angolaLocations, getMunicipiosByProvincia } from '../../../shared/utils/angolaLocations';
import { normalizeAngolaPhone } from '../../../shared/utils/phone';
import { getZodFieldErrors } from '../../../shared/utils/zodErrors';
import { deleteAccountSchema, passwordSettingsSchema, profileSettingsSchema } from '../validation/settingsSchemas';

const props = defineProps({ donor: { type: Object, default: null } });
const emit = defineEmits(['close', 'account-deleted']);
const authStore = useAuthStore();

const profileForm = ref({ email: '', telefone: '', provincia: '', municipio: '' });
const profileError = ref('');
const profileSuccess = ref('');
const isSavingProfile = ref(false);

const securityForm = ref({ nonce: '', password: '', confirmPassword: '' });
const securityError = ref('');
const securitySuccess = ref('');
const isSavingPassword = ref(false);
const nonceSuccess = ref('');
const isSendingNonce = ref(false);

const deleteConfirmation = ref('');
const deleteError = ref('');
const isDeletingAccount = ref(false);

const municipiosDisponiveis = computed(() => getMunicipiosByProvincia(profileForm.value.provincia));
const profileValidationResult = computed(() => profileSettingsSchema.safeParse(profileForm.value));
const profileFieldErrors = computed(() => getZodFieldErrors(profileValidationResult.value));
const passwordValidationResult = computed(() => passwordSettingsSchema.safeParse(securityForm.value));
const passwordFieldErrors = computed(() => getZodFieldErrors(passwordValidationResult.value));
const phoneInvalid = computed(() => Boolean(profileFieldErrors.value.telefone));
const passwordTooShort = computed(() => Boolean(passwordFieldErrors.value.password));
const passwordMismatch = computed(() => Boolean(passwordFieldErrors.value.confirmPassword));

const syncFormWithDonor = () => {
  profileForm.value = {
    email: props.donor?.email || authStore.currentUser?.email || '',
    telefone: props.donor?.telefone || '',
    provincia: props.donor?.provincia || '',
    municipio: props.donor?.municipio || ''
  };
};

watch(() => props.donor, syncFormWithDonor, { immediate: true });

const handleProvinceChange = () => {
  profileForm.value.municipio = '';
};

const saveProfile = async () => {
  profileError.value = '';
  profileSuccess.value = '';

  if (!profileValidationResult.value.success) {
    profileError.value = Object.values(profileFieldErrors.value)[0] || 'Revise os dados da conta.';
    return;
  }

  isSavingProfile.value = true;
  const result = await authStore.updateAccountProfile({
    email: profileForm.value.email.trim().toLowerCase(),
    telefone: normalizeAngolaPhone(profileForm.value.telefone),
    provincia: profileForm.value.provincia,
    municipio: profileForm.value.municipio,
    emailRedirectTo: `${window.location.origin}/?auth=login`
  });

  if (!result.ok) {
    profileError.value = authStore.authError || 'Nao foi possivel atualizar os dados da conta.';
    isSavingProfile.value = false;
    return;
  }

  profileSuccess.value = result.emailChanged
    ? 'Alteracoes guardadas. Recebera um email de confirmacao para validar a mudanca de endereco.'
    : 'Informacoes atualizadas com sucesso.';
  isSavingProfile.value = false;
};

const sendPasswordNonce = async () => {
  securityError.value = '';
  securitySuccess.value = '';
  nonceSuccess.value = '';
  isSendingNonce.value = true;

  const result = await authStore.requestPasswordChangeNonce();
  if (!result.ok) {
    securityError.value = authStore.authError || 'Nao foi possivel enviar o codigo de confirmacao.';
    isSendingNonce.value = false;
    return;
  }

  nonceSuccess.value = 'Enviamos um codigo de confirmacao por email. Introduza-o abaixo para concluir a troca da palavra-passe.';
  isSendingNonce.value = false;
};

const savePassword = async () => {
  securityError.value = '';
  securitySuccess.value = '';

  if (!passwordValidationResult.value.success) {
    securityError.value = Object.values(passwordFieldErrors.value)[0] || 'Revise os dados de seguranca.';
    return;
  }

  isSavingPassword.value = true;
  const result = await authStore.updatePassword({
    password: securityForm.value.password,
    nonce: securityForm.value.nonce.trim()
  });

  if (!result.ok) {
    securityError.value = authStore.authError || 'Nao foi possivel alterar a palavra-passe.';
    isSavingPassword.value = false;
    return;
  }

  securityForm.value = { nonce: '', password: '', confirmPassword: '' };
  nonceSuccess.value = '';
  securitySuccess.value = 'Palavra-passe alterada com sucesso.';
  isSavingPassword.value = false;
};

const deleteAccount = async () => {
  deleteError.value = '';
  const result = deleteAccountSchema.safeParse({ confirmation: deleteConfirmation.value });
  if (!result.success) {
    deleteError.value = getZodFieldErrors(result).confirmation || 'Confirme a eliminacao da conta.';
    return;
  }

  isDeletingAccount.value = true;
  const deleteResult = await authStore.deleteAccount();
  if (!deleteResult.ok) {
    deleteError.value = authStore.authError || 'Nao foi possivel eliminar a conta agora.';
    isDeletingAccount.value = false;
    return;
  }

  isDeletingAccount.value = false;
  emit('account-deleted');
};
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-400/45 backdrop-blur-sm" @click="emit('close')"></div>
    <div class="relative z-10 w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/50 bg-white shadow-[0_30px_80px_rgba(50,50,50,50.18)]">
      <div class="border-b border-slate-900 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white md:px-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-rose-200">Configuracoes</p>
            <h2 class="mt-2 text-2xl font-extrabold tracking-tight">Gerir conta</h2>
            <p class="mt-1 text-sm text-slate-300">Atualize email, contacto, localizacao, palavra-passe e os dados de acesso.</p>
          </div>
          <button type="button" @click="emit('close')" class="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20" aria-label="Fechar configuracoes">
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="max-h-[80vh] overflow-y-auto px-6 py-6 md:px-8 md:py-8">
        <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)] md:p-6">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><Mail class="h-5 w-5" /></div>
              <div>
                <h3 class="text-lg font-extrabold text-gray-900">Dados da conta</h3>
                <p class="text-sm text-gray-500">Atualize o email, numero e localizacao do perfil.</p>
              </div>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="mb-1.5 ml-1 block text-[13px] font-bold text-gray-700">Email</label>
                <input v-model="profileForm.email" type="email" placeholder="nome@exemplo.com" class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[14px] font-medium text-gray-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
              </div>

              <div>
                <label class="mb-1.5 ml-1 block text-[13px] font-bold text-gray-700">Numero</label>
                <div class="relative">
                  <Phone class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input v-model="profileForm.telefone" type="tel" placeholder="+244923000000" class="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-[14px] font-medium text-gray-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
                </div>
              </div>

              <div>
                <label class="mb-1.5 ml-1 block text-[13px] font-bold text-gray-700">Provincia</label>
                <select v-model="profileForm.provincia" @change="handleProvinceChange" class="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[14px] font-medium text-gray-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20">
                  <option value="" disabled>Selecione</option>
                  <option v-for="prov in Object.keys(angolaLocations)" :key="prov" :value="prov">{{ prov }}</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="mb-1.5 ml-1 block text-[13px] font-bold text-gray-700">Municipio</label>
                <div class="relative">
                  <MapPin class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <select v-model="profileForm.municipio" :disabled="!profileForm.provincia" class="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-[14px] font-medium text-gray-900 transition-all focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                    <option value="" disabled>Selecione o municipio</option>
                    <option v-for="municipio in municipiosDisponiveis" :key="municipio" :value="municipio">{{ municipio }}</option>
                  </select>
                </div>
              </div>
            </div>

            <p v-if="profileError" class="mt-4 text-[12px] font-bold text-rose-600">{{ profileError }}</p>
            <p v-else-if="phoneInvalid" class="mt-4 text-[12px] font-bold text-rose-600">Use 9 digitos ou o formato +244 seguido de 9 digitos.</p>
            <p v-else-if="profileSuccess" class="mt-4 text-[12px] font-bold text-emerald-600">{{ profileSuccess }}</p>

            <button type="button" @click="saveProfile" :disabled="isSavingProfile" class="mt-5 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-[14px] font-extrabold text-white shadow-[0_10px_24px_rgba(2,132,199,0.24)] transition-all hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
              {{ isSavingProfile ? 'A guardar...' : 'Guardar alteracoes' }}
            </button>
          </section>

          <div class="space-y-6">
            <section class="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_10px_25px_rgba(15,23,42,0.04)] md:p-6">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><ShieldCheck class="h-5 w-5" /></div>
                <div>
                  <h3 class="text-lg font-extrabold text-gray-900">Seguranca</h3>
                  <p class="text-sm text-gray-500">Confirme por email antes de concluir a troca da palavra-passe.</p>
                </div>
              </div>

              <div class="mt-6 space-y-4">
                <div class="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p class="text-[13px] font-semibold text-emerald-900">Passo 1: receber codigo de confirmacao</p>
                  <p class="mt-1 text-[12px] text-emerald-800">Recebera um codigo por email para autenticar a alteracao da palavra-passe.</p>
                  <button type="button" @click="sendPasswordNonce" :disabled="isSendingNonce" class="mt-3 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-[13px] font-extrabold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60">
                    {{ isSendingNonce ? 'A enviar codigo...' : 'Enviar codigo de confirmacao' }}
                  </button>
                </div>

                <div>
                  <label class="mb-1.5 ml-1 block text-[13px] font-bold text-gray-700">Codigo recebido por email</label>
                  <input v-model="securityForm.nonce" type="text" inputmode="numeric" placeholder="Ex.: 123456" class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[14px] font-medium tracking-[0.18em] text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>

                <div>
                  <label class="mb-1.5 ml-1 block text-[13px] font-bold text-gray-700">Nova palavra-passe</label>
                  <input v-model="securityForm.password" type="password" placeholder="Minimo 8 caracteres" class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[14px] font-medium text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>

                <div>
                  <label class="mb-1.5 ml-1 block text-[13px] font-bold text-gray-700">Confirmar palavra-passe</label>
                  <input v-model="securityForm.confirmPassword" type="password" placeholder="Repita a palavra-passe" class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[14px] font-medium text-gray-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                </div>
              </div>

              <p v-if="securityError" class="mt-4 text-[12px] font-bold text-rose-600">{{ securityError }}</p>
              <p v-else-if="nonceSuccess" class="mt-4 text-[12px] font-bold text-sky-600">{{ nonceSuccess }}</p>
              <p v-else-if="passwordTooShort" class="mt-4 text-[12px] font-bold text-rose-600">A palavra-passe precisa de pelo menos 8 caracteres.</p>
              <p v-else-if="passwordMismatch" class="mt-4 text-[12px] font-bold text-rose-600">As palavras-passe nao coincidem.</p>
              <p v-else-if="securitySuccess" class="mt-4 text-[12px] font-bold text-emerald-600">{{ securitySuccess }}</p>

              <button type="button" @click="savePassword" :disabled="isSavingPassword" class="mt-5 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-[14px] font-extrabold text-white shadow-[0_10px_24px_rgba(5,150,105,0.22)] transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                {{ isSavingPassword ? 'A atualizar...' : 'Alterar palavra-passe' }}
              </button>
            </section>

            <section class="rounded-[28px] border border-rose-200 bg-rose-50/70 p-5 shadow-[0_10px_25px_rgba(225,29,72,0.06)] md:p-6">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm"><AlertTriangle class="h-5 w-5" /></div>
                <div>
                  <h3 class="text-lg font-extrabold text-rose-900">Zona de risco</h3>
                  <p class="text-sm text-rose-700">Eliminar a conta apaga o acesso e remove os dados ligados ao utilizador.</p>
                </div>
              </div>

              <div class="mt-5 rounded-2xl border border-rose-200 bg-white/80 p-5">
                <p class="text-[13px] font-semibold text-rose-900">Digite <span class="font-black tracking-[0.18em]">ELIMINAR</span> para confirmar.</p>
                <input v-model="deleteConfirmation" type="text" placeholder="ELIMINAR" class="mt-3 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3.5 text-[14px] font-bold uppercase tracking-[0.12em] text-gray-900 transition-all focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              </div>

              <p v-if="deleteError" class="mt-4 text-[12px] font-bold text-rose-700">{{ deleteError }}</p>

              <button type="button" @click="deleteAccount" :disabled="isDeletingAccount" class="mt-5 inline-flex items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-[14px] font-extrabold text-white shadow-[0_10px_24px_rgba(225,29,72,0.12)] transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">
                {{ isDeletingAccount ? 'A eliminar...' : 'Eliminar conta' }}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
