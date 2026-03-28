<script setup>
import { computed, ref, defineEmits, defineProps, watch } from 'vue';
import RegisterForm from './RegisterForm.vue';
import { LogIn, UserPlus, Droplet, ArrowRight, ShieldCheck } from 'lucide-vue-next';
import { useAuthStore } from '../stores/authStore';

const props = defineProps({
  initialTab: {
    type: String,
    default: 'cadastro'
  }
});

const emit = defineEmits(['sucesso']);
const abaAtiva = ref(props.initialTab);
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');
const recoveryEmail = ref('');
const recoveryError = ref('');
const recoverySuccess = ref('');
const resetPassword = ref('');
const resetPasswordConfirm = ref('');
const resetError = ref('');
const resetSuccess = ref('');

const authStore = useAuthStore();
const displayedLoginError = computed(() => loginError.value || authStore.authError || '');

const recoveryEmailInvalid = computed(() => {
  const email = recoveryEmail.value.trim();
  if (!email) return false;
  return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
});

const resetPasswordShort = computed(() => resetPassword.value.length > 0 && resetPassword.value.length < 8);
const resetPasswordMismatch = computed(() => resetPasswordConfirm.value.length > 0 && resetPassword.value !== resetPasswordConfirm.value);
const canSubmitReset = computed(() => {
  return Boolean(resetPassword.value && resetPasswordConfirm.value && !resetPasswordShort.value && !resetPasswordMismatch.value && !authStore.isLoading);
});

const realizarLoginManual = async () => {
  loginError.value = '';
  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  if (!email) {
    loginError.value = 'Informe o email.';
    return;
  }

  if (!password) {
    loginError.value = 'Informe a palavra-passe.';
    return;
  }

  const result = await authStore.signIn({ email, password });
  if (!result.ok) {
    loginError.value = authStore.authError || 'Falha ao iniciar sessao.';
    return;
  }

  emit('sucesso');
};

const enviarRecuperacaoSenha = async () => {
  recoveryError.value = '';
  recoverySuccess.value = '';

  const email = recoveryEmail.value.trim().toLowerCase();
  if (!email) {
    recoveryError.value = 'Informe o email registado.';
    return;
  }

  if (recoveryEmailInvalid.value) {
    recoveryError.value = 'Informe um email valido.';
    return;
  }

  const redirectUrl = new URL(import.meta.env.BASE_URL || '/', window.location.origin);
  redirectUrl.searchParams.set('auth', 'redefinir-senha');

  const result = await authStore.requestPasswordRecovery({
    email,
    redirectTo: redirectUrl.toString()
  });

  if (!result.ok) {
    recoveryError.value = authStore.authError || 'Nao foi possivel enviar o link de recuperacao.';
    return;
  }

  recoverySuccess.value = 'Enviamos um link de recuperacao para o seu email.';
};

const redefinirSenha = async () => {
  resetError.value = '';
  resetSuccess.value = '';

  if (!resetPassword.value || !resetPasswordConfirm.value) {
    resetError.value = 'Preencha e confirme a nova palavra-passe.';
    return;
  }

  if (resetPasswordShort.value) {
    resetError.value = 'A nova palavra-passe precisa de pelo menos 8 caracteres.';
    return;
  }

  if (resetPasswordMismatch.value) {
    resetError.value = 'As palavras-passe nao coincidem.';
    return;
  }

  const result = await authStore.updatePassword({
    password: resetPassword.value
  });

  if (!result.ok) {
    resetError.value = authStore.authError || 'Nao foi possivel atualizar a palavra-passe.';
    return;
  }

  resetSuccess.value = 'Palavra-passe atualizada com sucesso.';
  emit('sucesso');
};

watch(
  () => props.initialTab,
  (nextTab) => {
    if (['cadastro', 'login', 'recuperar', 'redefinir-senha'].includes(nextTab)) {
      abaAtiva.value = nextTab;
      loginError.value = '';
      recoveryError.value = '';
      recoverySuccess.value = '';
      resetError.value = '';
      resetSuccess.value = '';
      if (nextTab === 'recuperar' && loginEmail.value) {
        recoveryEmail.value = loginEmail.value.trim().toLowerCase();
      }
    }
  }
);
</script>

<template>
  <div class="flex flex-col md:flex-row w-full max-w-275 min-h-auto md:min-h-150 bg-white overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100/50 rounded-4xl md:rounded-[40px] relative z-20 m-auto">
    <div class="w-full md:w-[320px] bg-linear-to-br from-[#0F172A] to-[#1E293B] p-8 md:p-10 flex flex-col justify-between gap-6 relative overflow-hidden shrink-0 group">
      <div class="absolute top-0 right-0 w-75 h-75 bg-rose-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all duration-700 group-hover:bg-rose-500/20"></div>

      <div class="relative z-10">
        <div class="flex items-center gap-2.5 mb-12">
          <Droplet class="w-6 h-6 text-rose-500" stroke-width="2.5" />
          <span class="text-xl font-black text-white tracking-tight">UniVida</span>
        </div>

        <h2 class="text-white text-[11px] font-bold mb-6 opacity-50 uppercase tracking-[0.2em] flex items-center gap-2">
          <span class="w-4 h-px bg-white/30"></span> Acesso Segurado
        </h2>

        <div class="flex flex-row md:flex-col gap-3">
          <button
            @click="abaAtiva = 'cadastro'"
            :class="abaAtiva === 'cadastro'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 border-rose-500 ring-1 ring-white/20'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-transparent'"
            class="flex-1 md:w-full p-4 rounded-[20px] font-bold text-[15px] transition-all duration-300 text-left flex items-center gap-3 border backdrop-blur-sm group/btn"
          >
            <div :class="abaAtiva === 'cadastro' ? 'bg-white/20' : 'bg-gray-800'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
              <UserPlus class="w-5 h-5" :class="abaAtiva === 'cadastro' ? 'text-white' : 'text-gray-400 group-hover/btn:text-white'" stroke-width="2" />
            </div>
            <span class="hidden sm:block">Criar Conta</span>
          </button>

          <button
            @click="abaAtiva = 'login'"
            :class="abaAtiva === 'login'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20 border-rose-500 ring-1 ring-white/20'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-transparent'"
            class="flex-1 md:w-full p-4 rounded-[20px] font-bold text-[15px] transition-all duration-300 text-left flex items-center gap-3 border backdrop-blur-sm group/btn"
          >
            <div :class="abaAtiva === 'login' ? 'bg-white/20' : 'bg-gray-800'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
              <LogIn class="w-5 h-5" :class="abaAtiva === 'login' ? 'text-white' : 'text-gray-400 group-hover/btn:text-white'" stroke-width="2" />
            </div>
            <span class="hidden sm:block">Fazer Login</span>
          </button>
        </div>
      </div>

      <div class="relative z-10 mt-auto pt-8 border-t border-white/10 hidden md:flex items-start gap-3 text-[13px] text-gray-400 font-medium">
        <ShieldCheck class="w-5 h-5 shrink-0 text-emerald-400" stroke-width="2" />
        <p>Os seus dados medicos são encriptados ponto-a-ponto e partilhados apenas com hospitais autorizados caso necessário.</p>
      </div>
    </div>

    <div class="w-full md:flex-1 p-6 md:p-12 bg-white flex flex-col justify-center relative min-h-auto md:min-h-125">
      <div class="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] bg-size-[24px_24px] opacity-30 mix-blend-multiply pointer-events-none"></div>

      <Transition name="fade" mode="out-in">
        <div :key="abaAtiva" class="w-full relative z-10 h-full flex flex-col justify-center">
          <div v-if="abaAtiva === 'cadastro'" class="w-full max-w-2xl mx-auto animation-slide-up">
            <div class="mb-8">
              <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Junte-se a Rede</h2>
              <p class="text-[15px] text-gray-500 font-medium">Complete os seus dados basicos para integrar com a rede de doadores.</p>
            </div>
            <RegisterForm @sucesso="$emit('sucesso')" />
          </div>

          <div v-else-if="abaAtiva === 'login'" class="w-full max-w-md mx-auto animation-slide-up">
            <div class="mb-10 text-center">
              <div class="w-16 h-16 bg-rose-50 text-rose-600 rounded-[20px] flex items-center justify-center mx-auto mb-6 border border-rose-100">
                <Droplet class="w-8 h-8 fill-rose-600/20" stroke-width="2" />
              </div>
              <h2 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Bem-vindo de volta</h2>
              <p class="text-[15px] text-gray-500 font-medium">Entre com a sua conta para aceder ao painel.</p>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">E-mail</label>
                <input v-model="loginEmail" type="email" placeholder="nome@exemplo.com" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-gray-400 font-medium" />
                <p v-if="displayedLoginError" class="text-[12px] text-rose-600 font-bold mt-2">{{ displayedLoginError }}</p>
              </div>

              <div>
                <div class="flex justify-between items-center mb-1.5 ml-1 mr-1">
                  <label class="text-[13px] font-bold text-gray-700">Palavra-passe</label>
                  <button @click="abaAtiva = 'recuperar'" class="text-[12px] font-bold text-rose-600 hover:text-rose-700 transition-colors">Esqueceu a senha?</button>
                </div>
                <input v-model="loginPassword" type="password" placeholder="••••••••" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium placeholder:text-gray-400" />
              </div>

              <button @click="realizarLoginManual" :disabled="authStore.isLoading" class="w-full bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold text-[15px] shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                <span>{{ authStore.isLoading ? 'A entrar...' : 'Acessar Painel' }}</span>
                <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1" stroke-width="2.5" />
              </button>
            </div>

            <p class="text-center text-[14px] text-gray-500 font-medium mt-8">
              Nao tem uma conta? <button @click="abaAtiva = 'cadastro'" class="text-rose-600 font-bold hover:underline">Registe-se agora</button>
            </p>
          </div>

          <div v-else-if="abaAtiva === 'recuperar'" class="w-full max-w-md mx-auto animation-slide-up">
            <div class="mb-10 text-center">
              <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center mx-auto mb-6 border border-blue-100">
                <ShieldCheck class="w-8 h-8 fill-blue-600/20" stroke-width="2" />
              </div>
              <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Recuperar Acesso</h2>
              <p class="text-[15px] text-gray-500 font-medium">Informe o email da conta para receber o link de redefinicao de senha.</p>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">E-mail registado</label>
                <input v-model="recoveryEmail" type="email" placeholder="nome@exemplo.com" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium" />
                <p v-if="recoveryError" class="text-[12px] text-rose-600 font-bold mt-2">{{ recoveryError }}</p>
                <p v-else-if="recoverySuccess" class="text-[12px] text-emerald-600 font-bold mt-2">{{ recoverySuccess }}</p>
              </div>

              <button type="button" @click="enviarRecuperacaoSenha" :disabled="authStore.isLoading || recoveryEmailInvalid" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-[15px] shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {{ authStore.isLoading ? 'A enviar link...' : 'Recuperar Senha' }}
              </button>

              <button type="button" @click="abaAtiva = 'login'" class="w-full bg-white hover:bg-gray-50 text-blue-700 border border-blue-200 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all flex justify-center items-center gap-2">
                Voltar para login
              </button>
            </div>
          </div>

          <div v-else-if="abaAtiva === 'redefinir-senha'" class="w-full max-w-md mx-auto animation-slide-up">
            <div class="mb-10 text-center">
              <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[20px] flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <ShieldCheck class="w-8 h-8 fill-emerald-600/20" stroke-width="2" />
              </div>
              <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Definir Nova Senha</h2>
              <p class="text-[15px] text-gray-500 font-medium">Crie uma nova palavra-passe para voltar a aceder ao painel com seguranca.</p>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Nova palavra-passe</label>
                <input v-model="resetPassword" type="password" placeholder="Minimo 8 caracteres" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 font-medium" />
              </div>

              <div>
                <label class="block text-[13px] font-bold text-gray-700 mb-1.5 ml-1">Confirmar nova palavra-passe</label>
                <input v-model="resetPasswordConfirm" type="password" placeholder="Repita a palavra-passe" class="w-full bg-gray-50 border border-gray-200 text-gray-900 text-[15px] rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 font-medium" />
                <p v-if="resetError" class="text-[12px] text-rose-600 font-bold mt-2">{{ resetError }}</p>
                <p v-else-if="resetPasswordShort" class="text-[12px] text-rose-600 font-bold mt-2">A nova palavra-passe precisa de pelo menos 8 caracteres.</p>
                <p v-else-if="resetPasswordMismatch" class="text-[12px] text-rose-600 font-bold mt-2">As palavras-passe nao coincidem.</p>
                <p v-else-if="resetSuccess" class="text-[12px] text-emerald-600 font-bold mt-2">{{ resetSuccess }}</p>
              </div>

              <button type="button" @click="redefinirSenha" :disabled="!canSubmitReset" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-bold text-[15px] shadow-[0_4px_14px_rgba(5,150,105,0.2)] transition-all hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {{ authStore.isLoading ? 'A atualizar...' : 'Atualizar Senha' }}
              </button>

              <button type="button" @click="abaAtiva = 'login'" class="w-full bg-white hover:bg-gray-50 text-emerald-700 border border-emerald-200 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all flex justify-center items-center gap-2">
                Voltar para login
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>

  <div class="fixed inset-0 pointer-events-none z-0 hidden lg:block">
    <div class="absolute top-1/4 left-1/4 w-125 h-125 bg-rose-200/20 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-1/4 right-1/4 w-150 h-150 bg-blue-200/20 rounded-full blur-[120px]"></div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.animation-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
