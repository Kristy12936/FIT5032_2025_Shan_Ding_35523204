import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 添加 PrimeVue 的别名解析
      'primevue': path.resolve(__dirname, 'node_modules/primevue')
    }
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [
        // 将 PrimeVue 相关包外部化，或者按需处理
      ],
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // 移除 primevue  chunk，改为按需加载
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: [
      'primevue/config',
      // 添加其他需要预构建的依赖
    ],
    exclude: [
      // 排除可能导致问题的包
    ]
  }
})