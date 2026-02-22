<script setup>
import { ref } from 'vue';
import AboutSection from './components/AboutSection.vue';
import Header from './components/Header.vue';
import HeaderCard from './components/HeaderCard.vue';
import StepsSection from './components/StepsSection.vue';
import CampaignSection from './components/CampaignSection.vue';
import Footer from './components/Footer.vue';
import AuthContainer from './components/AuthContainer.vue';
import UserDashboard from './components/UserDashboard.vue';

// 1. Estado para controlar se mostra a Landing Page ou a Dashboard
const usuarioLogado = ref(false);

// 2. Estado do Modal de Autenticação
const mostrarModal = ref(false);

const abrirCadastro = () => mostrarModal.value = true;
const fecharCadastro = () => mostrarModal.value = false;

// 3. Função para simular o Login/Sucesso no Cadastro
const entrarNoSistema = () => {
  fecharCadastro();
  usuarioLogado.value = true;
  window.scrollTo(0, 0); // Volta ao topo da página
};

const sairDoSistema = () => {
  usuarioLogado.value = false;
};
</script>

<template>
  <div v-if="usuarioLogado">
    <UserDashboard @logout="sairDoSistema" />
  </div>

  <div v-else>
    <Header @click-cadastro="abrirCadastro" />
    
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
      
      <div class="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <button @click="fecharCadastro" class="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>

       <div v-if="mostrarModal" class="fixed inset-0 z-100 flex items-center justify-center p-4">
        <AuthContainer @sucesso="entrarNoSistema" />
      </div>
      </div>
    </div>
  </div>
</template>