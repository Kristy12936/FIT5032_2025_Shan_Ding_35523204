import { createRouter, createWebHistory } from 'vue-router'

// 页面组件导入（懒加载的无需写这里）
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
import ArticleDetail from '@/views/ArticleDetail.vue'  // 导入文章详情页面

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/articles', name: 'Articles', component: Articles },
  
  // 文章详情动态路由
  { 
    path: '/articles/:id', 
    name: 'ArticleDetail', 
    component: ArticleDetail,  // 文章详情页面
    meta: { requiresAuth: true }  // 你可以根据需求设置权限
  },

  { path: '/events', name: 'Events', component: EventList },

  {
    path: '/event/:id',
    name: 'EventDetail',
    component: EventDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/events/:id',
    redirect: to => `/event/${to.params.id}`
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },

   {
  path: '/email',
  name: 'EmailForm',
  component: () => import('@/views/EmailForm.vue'),
  meta: { requiresAuth: true }   // 需要登录才能访问
  },

  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },

  // ✅ 懒加载 EventsTable
  {
    path: '/events-table',
    name: 'EventsTable',
    component: () => import('@/views/EventsTable.vue'),
    meta: { requiresAuth: true }
  },

  // ✅ 懒加载 ArticlesTable
  {
    path: '/articles-table',
    name: 'ArticlesTable',
    component: () => import('@/views/ArticlesTable.vue'),
    meta: { requiresAuth: true }
  },

  { path: '/feedback', name: 'Feedback', component: Feedback },
  { path: '/resources', name: 'Resources', component: HealthResources },



 

  // 404 页面兜底
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]




const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ 权限导航守卫
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const isLoggedIn = !!user
  const isAdmin = user?.email === 'admin@age.com'

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login' })
  }
  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'Home' })
  }
  next()
})

export default router
