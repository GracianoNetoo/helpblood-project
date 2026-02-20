<script setup>
import { ref } from 'vue';
import AboutSection from './components/AboutSection.vue';
import Header from './components/Header.vue';
import HeaderCard from './components/HeaderCard.vue';
import StepsSection from './components/StepsSection.vue';
import CampaignSection from './components/CampaignSection.vue';
import Footer from './components/Footer.vue';
import RegisterForm from './components/RegisterForm.vue';
import AuthContainer from './components/AuthContainer.vue'
const mostrarModal = ref(false)

const abrirCadastro = () => {
  mostrarModal.value = true
}

const fecharCadastro = () => {
  mostrarModal.value = false
}
</script>
<template>
  <button @click="abrirCadastro" class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">
    Cadastrar como Doador
  </button>

  <div v-if="mostrarModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">

    <div @click="fecharCadastro" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

    <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">

      <button @click="fecharCadastro" class="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <RegisterForm @sucesso="fecharCadastro" />

    </div>
  </div>
  <div>
    <Header />
  </div>
  <div>
    <main>
      <HeaderCard />
    </main>
    <section>
      <AboutSection />
    </section>
    <section>
      <StepsSection />
    </section>
    <section>
      <CampaignSection />
    </section>
  </div>
  <div>
    <AuthContainer />
  </div>
  <footer>
    <Footer />
  </footer>
</template>

<style scoped></style>