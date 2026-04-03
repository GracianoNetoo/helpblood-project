export const adminRoutes = [
  {
    path: '/admin',
    component: () => import('../../../shared/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin',
        component: () => import('../../../features/admin/views/AdminDashboardView.vue'),
        meta: {
          requiresAuth: true,
          requiresAdmin: true
        }
      }
    ]
  }
];
