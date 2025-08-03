import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
   { path: '/',name: 'LoginView',component: LoginView,},
   { path: '/RegisterView',name: 'RegisterView',component: RegisterView,}, 
   { path: '/HomeView',name: 'HomeView',component: HomeView,},
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
   routes 
})

export default router
