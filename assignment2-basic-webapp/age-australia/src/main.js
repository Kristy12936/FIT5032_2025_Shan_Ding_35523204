// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())

// 初始化 AOS 动画库
router.isReady().then(() => {
  AOS.init()
  app.mount('#app')
})
