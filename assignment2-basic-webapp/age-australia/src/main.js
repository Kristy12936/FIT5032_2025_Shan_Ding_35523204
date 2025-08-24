import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 样式导入
import 'bootstrap/dist/css/bootstrap.min.css'
import 'aos/dist/aos.css'
import AOS from 'aos'

// PrimeVue 样式和核心插件
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// ✅ PrimeVue 组件注册
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// ✅ 导入认证存储
import { useAuthStore } from '@/store/auth'

// ✅ 创建应用
const app = createApp(App)

// ✅ 使用插件
app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ConfirmationService)

// ✅ 注册全局组件
app.component('Button', Button)
app.component('Textarea', Textarea)
app.component('ConfirmDialog', ConfirmDialog)
app.component('DataTable', DataTable)
app.component('Column', Column)

// ✅ 等路由就绪后挂载并初始化 AOS 和认证
router.isReady().then(() => {
  // 初始化 AOS 动画
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  })
  
  // 初始化认证状态监听
  const authStore = useAuthStore()
  authStore.init()
  
  app.mount('#app')
})

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err)
  console.log('Vue instance:', instance)
  console.log('Error info:', info)
}