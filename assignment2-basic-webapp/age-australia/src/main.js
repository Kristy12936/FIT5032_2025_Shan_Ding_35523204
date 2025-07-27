  // src/main.js
  import { createApp } from 'vue'
  import App from './App.vue'
  import router from './router'
  import { createPinia } from 'pinia'

  // 样式导入
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'aos/dist/aos.css'
  import AOS from 'aos'

  // PrimeVue 样式和组件
  import PrimeVue from 'primevue/config'
  import Button from 'primevue/button'
  import Textarea from 'primevue/textarea'
  import ConfirmDialog from 'primevue/confirmdialog'
  import ConfirmationService from 'primevue/confirmationservice'
  import 'primevue/resources/themes/lara-light-blue/theme.css'
  import 'primevue/resources/primevue.min.css'
  import 'primeicons/primeicons.css'
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.bundle.min.js' // 👈 这一行非常重要！




  // ✅ 1. 创建 app 实例
  const app = createApp(App)

  // ✅ 2. 安装插件
  app.use(router)
  app.use(createPinia())
  app.use(PrimeVue)
  app.use(ConfirmationService)

  // ✅ 3. 注册全局组件
  app.component('Button', Button)
  app.component('Textarea', Textarea)
  app.component('ConfirmDialog', ConfirmDialog)

  // ✅ 4. 初始化动画库并挂载
  router.isReady().then(() => {
    AOS.init()
    app.mount('#app')
  })
