import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import AdminDashboardView from '../views/AdminDashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView
    }
  ],
  scrollBehavior() {
    return { top: 0 }
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
