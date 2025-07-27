import { createRouter, createWebHistory } from 'vue-router'

// ✅ 页面组件导入（请确保路径/大小写正确）
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Articles from '@/views/Articles.vue'
import EventList from '@/views/EventList.vue'
import EventDetail from '@/views/EventDetail.vue'
import Dashboard from '@/views/Dashboard.vue'
import AdminPanel from '@/views/AdminPanel.vue'
import Feedback from '@/views/Feedback.vue'
import HealthResources from '@/views/HealthResources.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/articles', name: 'Articles', component: Articles },
  { path: '/events', name: 'Events', component: EventList },
  { path: '/event/:id', name: 'EventDetail', component: EventDetail, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/admin', name: 'AdminPanel', component: AdminPanel, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/feedback', name: 'Feedback', component: Feedback },
  { path: '/resources', name: 'Resources', component: HealthResources },

  // ✅ 404 页面兜底
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ 权限导航守卫
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.meta.requiresAuth && !user) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    return next({ name: 'Home' })
  }

  next()
})

export default router
