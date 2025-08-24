import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 样式导入
import 'bootstrap/dist/css/bootstrap.min.css'
import 'aos/dist/aos.css'

// 正确导入 PrimeVue - 使用命名导入而不是默认导入
import PrimeVue from 'primevue/config'
// 移除这些全局样式导入，改为在组件中按需导入
// import 'primevue/resources/themes/lara-light-blue/theme.css'
// import 'primevue/resources/primevue.min.css'
// import 'primeicons/primeicons.css'

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// ✅ 创建应用
const app = createApp(App)
const pinia = createPinia()

// ✅ 使用插件
app.use(pinia)
app.use(router)

// 有条件地使用 PrimeVue - 只在开发环境或需要时
try {
  app.use(PrimeVue, {
    ripple: true,
    // 可选的主题配置
    theme: {
      preset: 'lara-light-blue'
    }
  })
  console.log('PrimeVue initialized successfully')
} catch (error) {
  console.warn('PrimeVue initialization failed, continuing without it:', error)
}

// ✅ 按需导入 PrimeVue 组件（而不是全局注册）
// 移除全局组件注册，改为在具体组件中导入

// ✅ 简化挂载过程
const initApp = async () => {
  try {
    // 等待路由就绪
    await router.isReady()
    
    // 挂载应用
    app.mount('#app')
    
    console.log('App mounted successfully')
    
  } catch (error) {
    console.error('Failed to initialize app:', error)
    
    // 降级方案：直接挂载
    app.mount('#app')
  }
}

// 初始化应用
initApp()

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err)
  console.log('Vue instance:', instance)
  console.log('Error info:', info)
}