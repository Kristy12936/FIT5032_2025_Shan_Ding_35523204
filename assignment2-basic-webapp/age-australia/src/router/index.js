// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import EventList from '@/views/EventList.vue'
import EventDetail from '@/views/EventDetail.vue'
import AdminPanel from '@/views/AdminPanel.vue'

const routes = [
  { path: '/', component: EventList },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/events', component: EventList },
  { path: '/events/:id', component: EventDetail, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminPanel, meta: { requiresAuth: true, requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    return next('/')
  }

  next()
})

export default router
