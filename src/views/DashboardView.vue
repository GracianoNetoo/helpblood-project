<script setup>
import { useRouter } from 'vue-router';
import UserDashboard from '../features/user/components/UserDashboard.vue';
import { useAuthStore } from '../features/auth/store/authStore';

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
