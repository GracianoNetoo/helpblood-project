<script setup>
import { RouterView } from 'vue-router';
import GlobalToastStack from './shared/components/GlobalToastStack.vue';
</script>

<template>
  <GlobalToastStack />
  <RouterView />
</template>
