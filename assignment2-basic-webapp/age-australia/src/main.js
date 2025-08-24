// src/main.js
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

// ✅ 创建应用
const app = createApp(App)

// ✅ 使用插件
app.use(router)
app.use(createPinia())
app.use(PrimeVue)
app.use(ConfirmationService)

// ✅ 注册全局组件
app.component('Button', Button)
app.component('Textarea', Textarea)
app.component('ConfirmDialog', ConfirmDialog)
app.component('DataTable', DataTable)
app.component('Column', Column)

// ✅ 等路由就绪后挂载并初始化 AOS
router.isReady().then(() => {
  AOS.init()
  app.mount('#app')
})
