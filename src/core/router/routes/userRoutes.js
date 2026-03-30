export const userRoutes = [
  {
    path: '/dashboard',
    component: () => import('../../../shared/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../../../views/DashboardView.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
];
