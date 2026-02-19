<script setup>
import AboutSection from './components/AboutSection.vue';
import Header from './components/Header.vue';
import HeaderCard from './components/HeaderCard.vue';
import StepsSection from './components/StepsSection.vue';
import CampaignSection from './components/CampaignSection.vue';
</script>

<template>
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
</template>

<style scoped>
</style>