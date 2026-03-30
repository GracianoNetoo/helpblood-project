import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import { useAuthStore } from './features/auth/store/authStore';

const bootstrap = async () => {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  const authStore = useAuthStore(pinia);
  await authStore.initialize();

  app.use(router);
  await router.isReady();
  app.mount('#app');
};

bootstrap();
