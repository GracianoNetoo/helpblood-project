<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AboutSection from '../components/AboutSection.vue';
import Header from '../components/Header.vue';
import HeaderCard from '../components/HeaderCard.vue';
import StepsSection from '../components/StepsSection.vue';
import CampaignSection from '../components/CampaignSection.vue';
import Footer from '../components/Footer.vue';
import AuthContainer from '../components/AuthContainer.vue';
import HelpRequestForm from '../components/HelpRequestForm.vue';
import PartnerContactModal from '../components/PartnerContactModal.vue';
import TermsModal from '../components/TermsModal.vue';
import { useAppointmentsStore } from '../stores/appointmentsStore';

const router = useRouter();
const appointmentsStore = useAppointmentsStore();
const authTab = ref('cadastro');
const postAuthAction = ref('dashboard'); // 'dashboard' | 'booking'

// 2. Estado do Modal de Autenticação
const mostrarModal = ref(false);
const mostrarPedidoModal = ref(false);
const mostrarParceriaModal = ref(false);
const mostrarTermosModal = ref(false);

const abrirCadastro = () => {
  authTab.value = 'cadastro';
  postAuthAction.value = 'dashboard';
  mostrarModal.value = true;
  document.body.style.overflow = 'hidden'; 
};

const abrirLogin = () => {
  authTab.value = 'login';
  postAuthAction.value = 'dashboard';
  mostrarModal.value = true;
  document.body.style.overflow = 'hidden';
};

const abrirCadastroParaAgendar = () => {
  authTab.value = 'cadastro';
  postAuthAction.value = 'booking';
  mostrarModal.value = true;
  document.body.style.overflow = 'hidden';
};

const fecharCadastro = () => {
  mostrarModal.value = false;
  document.body.style.overflow = ''; 
};

// 3. Função para simular o Login/Sucesso no Cadastro
const entrarNoSistema = () => {
  fecharCadastro();
  if (postAuthAction.value === 'booking') {
    appointmentsStore.requestOpenBooking();
    router.push({ path: '/dashboard', query: { tab: 'appointments' } });
  } else {
    router.push('/dashboard');
  }
  postAuthAction.value = 'dashboard';
  window.scrollTo(0, 0); // Volta ao topo da página
};

const abrirPedidoAjuda = () => {
  mostrarPedidoModal.value = true;
  document.body.style.overflow = 'hidden';
};

const fecharPedidoAjuda = () => {
  mostrarPedidoModal.value = false;
  document.body.style.overflow = '';
};

const abrirParceria = () => {
  mostrarParceriaModal.value = true;
  document.body.style.overflow = 'hidden';
};

const fecharParceria = () => {
  mostrarParceriaModal.value = false;
  document.body.style.overflow = '';
};

const abrirTermos = () => {
  mostrarTermosModal.value = true;
  document.body.style.overflow = 'hidden';
};

const fecharTermos = () => {
  mostrarTermosModal.value = false;
  document.body.style.overflow = '';
};

onUnmounted(() => {
  document.body.style.overflow = '';
});

</script>

<template>
  <div>
    <Header @click-cadastro="abrirCadastro" @click-login="abrirLogin" />
    
    <main>
      <HeaderCard @click-pedir-doacao="abrirPedidoAjuda" @click-quero-doar="abrirCadastroParaAgendar" />
      <AboutSection />
      <StepsSection @click-agendar-doacao="abrirCadastroParaAgendar" />
      <CampaignSection @click-agendar-horario="abrirCadastroParaAgendar" @click-solicitar-parceria="abrirParceria" />
      
      <section class="py-20 bg-gray-100">
         <div class="container mx-auto px-6">
            <AuthContainer @sucesso="entrarNoSistema" />
         </div>
      </section>
    </main>

    <Footer @open-terms="abrirTermos" />

    <div v-if="mostrarModal" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div @click="fecharCadastro" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div class="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex items-center justify-center p-4 custom-scrollbar">
        <button @click="fecharCadastro" class="absolute top-4 right-4 md:top-8 md:right-8 z-50 text-gray-400 hover:text-rose-600 bg-white/10 hover:bg-white p-2 rounded-full backdrop-blur-md transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
        <AuthContainer :initialTab="authTab" @sucesso="entrarNoSistema" />
      </div>
    </div>

    <div v-if="mostrarPedidoModal" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div @click="fecharPedidoAjuda" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div class="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex items-center justify-center p-4 custom-scrollbar">
        <HelpRequestForm @submitted="fecharPedidoAjuda" @cancel="fecharPedidoAjuda" />
      </div>
    </div>

    <div v-if="mostrarParceriaModal" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div @click="fecharParceria" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div class="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex items-center justify-center p-4 custom-scrollbar">
        <PartnerContactModal @close="fecharParceria" />
      </div>
    </div>

    <div v-if="mostrarTermosModal" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div @click="fecharTermos" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div class="relative w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex items-center justify-center p-4 custom-scrollbar">
        <TermsModal @close="fecharTermos" />
      </div>
    </div>
  </div>
</template>

<style>
/* Custom Scrollbar for Modal wrapper */
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
