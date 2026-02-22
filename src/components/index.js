import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // Sua Landing Page atual
import UserDashboard from '../components/UserDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: UserDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router