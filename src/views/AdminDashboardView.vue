<script setup>
import { useRouter } from 'vue-router';
import AdminDashboard from '../admin/AdminDashboard.vue';

const router = useRouter();

const sairDoSistema = () => {
  router.push('/');
};
</script>

<template>
  <AdminDashboard @logout="sairDoSistema" />
</template>
