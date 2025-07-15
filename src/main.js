// 引入主样式
import './assets/main.css'
// import './style.css'  //  注释掉自定义样式（Activity 3 用的）

// 引入 Bootstrap 样式
import 'bootstrap/dist/css/bootstrap.min.css'

// Vue 创建入口
import { createApp } from 'vue'
import App from './App.vue'

// PrimeVue 配置（Activity 4）
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

// 创建 Vue 应用实例
const app = createApp(App)

// 应用 PrimeVue 主题配置
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

// 挂载到 DOM
app.mount('#app')
