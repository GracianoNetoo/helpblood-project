import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../../features/auth/store/authStore';
import { publicRoutes } from './routes/publicRoutes';
import { userRoutes } from './routes/userRoutes';
import { adminRoutes } from './routes/adminRoutes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes, ...userRoutes, ...adminRoutes],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  await authStore.initialize();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/', query: { auth: 'login' } };
  }

  return true;
});

export default router;
