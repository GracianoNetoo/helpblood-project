<script setup>
import { useRouter } from 'vue-router';
import UserDashboard from '../components/UserDashboard.vue';

const router = useRouter();

const sairDoSistema = () => {
  router.push('/');
};
</script>

<template>
  <UserDashboard @logout="sairDoSistema" />
</template>
