<script setup>
import { useRouter } from 'vue-router';
import UserDashboard from '../components/UserDashboard.vue';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const sairDoSistema = async () => {
  await authStore.signOut();
  router.push('/');
};

const handleAccountDeleted = async () => {
  router.push('/');
};
</script>

<template>
  <UserDashboard @logout="sairDoSistema" @account-deleted="handleAccountDeleted" />
</template>
