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

const router = useRouter();
const authTab = ref('cadastro');

// 2. Estado do Modal de Autenticação
const mostrarModal = ref(false);

const abrirCadastro = () => {
  authTab.value = 'cadastro';
  mostrarModal.value = true;
  document.body.style.overflow = 'hidden'; 
};

const abrirLogin = () => {
  authTab.value = 'login';
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
  router.push('/dashboard');
  window.scrollTo(0, 0); // Volta ao topo da página
};

onUnmounted(() => {
  document.body.style.overflow = '';
});

</script>

<template>
  <div>
    <Header @click-cadastro="abrirCadastro" @click-login="abrirLogin" />
    
    <main>
      <HeaderCard />
      <AboutSection />
      <StepsSection />
      <CampaignSection />
      
      <section class="py-20 bg-gray-100">
         <div class="container mx-auto px-6">
            <AuthContainer @sucesso="entrarNoSistema" />
         </div>
      </section>
    </main>

    <Footer />

    <div v-if="mostrarModal" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div @click="fecharCadastro" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      
      <div class="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex items-center justify-center p-4 custom-scrollbar">
        <button @click="fecharCadastro" class="absolute top-4 right-4 md:top-8 md:right-8 z-50 text-gray-400 hover:text-rose-600 bg-white/10 hover:bg-white p-2 rounded-full backdrop-blur-md transition-all shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
        <AuthContainer :initialTab="authTab" @sucesso="entrarNoSistema" />
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
