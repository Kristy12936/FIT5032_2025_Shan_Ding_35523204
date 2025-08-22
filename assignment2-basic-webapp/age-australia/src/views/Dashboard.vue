<template>
  <div class="dashboard-wrapper py-5">
    <div class="container" data-aos="fade-up">
      <!-- 用户信息卡 -->
      <div class="card p-4 shadow-sm border-0 mb-5">
        <h2 class="mb-3 text-primary">
          <i class="fas fa-user-circle me-2"></i> My Dashboard
        </h2>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p>
          <strong>Role:</strong>
          <span class="badge" :class="isAdmin ? 'bg-danger' : 'bg-secondary'">
            {{ isAdmin ? 'admin' : 'user' }}
          </span>
        </p>

        <!-- ✅ 所有人可见的表格导航 -->
        <div class="d-flex gap-3 mt-3 flex-wrap">
          <router-link
            to="/events-table"
            class="btn btn-outline-primary"
          >
            <i class="pi pi-calendar me-2"></i> View Events Table
          </router-link>

          <router-link
            to="/articles-table"
            class="btn btn-outline-secondary"
          >
            <i class="pi pi-book me-2"></i> View Articles Table
          </router-link>
        </div>
      </div>

      <!-- ✅ 注册活动 -->
      <div class="mb-5">
        <h4 class="mb-3">
          <i class="fas fa-calendar-check me-2 text-success"></i> Registered Events
        </h4>
        <div v-if="registeredEvents.length" class="row g-4">
          <div class="col-md-6" v-for="event in registeredEvents" :key="event.id">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">{{ event.title }}</h5>
                <p><strong>Date:</strong> {{ event.date }}</p>
                <p>{{ event.description }}</p>
                <p><strong>Avg Rating:</strong> {{ getAvgRating(event) }}</p>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-muted">You haven't joined any events yet.</p>
      </div>

      <!-- ✅ 收藏文章 -->
      <div>
        <h4 class="mb-3">
          <i class="fas fa-star me-2 text-warning"></i> Saved Articles
        </h4>
        <div v-if="savedArticles.length" class="row g-3">
          <div class="col-md-6" v-for="article in savedArticles" :key="article.id">
            <div class="card shadow-sm">
              <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-0">{{ article.title }}</h6>
                </div>
                <router-link to="/articles" class="btn btn-sm btn-outline-secondary">
                  Go
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-muted">No articles saved yet.</p>
      </div>

      <!-- 调试信息：显示已保存文章的数量 -->
      <p>Debug: Saved articles count: {{ savedArticles.length }}</p> <!-- Debugging line -->

      <!-- 导出按钮 -->
      <div class="text-center mt-4">
        <button @click="exportSavedArticlesAsCSV" class="btn btn-primary me-3" v-if="savedArticles.length > 0">Export Saved Articles as CSV</button>
        <button @click="exportSavedArticlesAsPDF" class="btn btn-secondary" v-if="savedArticles.length > 0">Export Saved Articles as PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { exportToCSV, exportToPDF } from '@/utils/exportUtils'  // 导入导出函数

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isAdmin = computed(() => user.value?.email === 'admin@age.com')

const registeredEvents = ref([])
const savedArticles = ref([])

onMounted(async () => {
  if (!user.value) return

  // 获取所有活动
  const snapshot = await getDocs(collection(db, 'events'))
  const allEvents = []
  snapshot.forEach(doc => {
    allEvents.push({ id: doc.id, ...doc.data() })
  })

  // 筛选已注册的活动
  registeredEvents.value = allEvents.filter(e =>
    e.participants?.includes(user.value.email)
  )

  // 获取已保存文章
  const userLocal = JSON.parse(localStorage.getItem('user') || '{}')
  const allArticles = await fetch('/articles.json').then(r => r.json())
  savedArticles.value = allArticles.filter(a => userLocal.favorites?.includes(a.id))

  // 输出调试信息
  console.log(savedArticles.value)  // 确保数据加载正常
})

// 获取活动的平均评分
const getAvgRating = (event) => {
  if (!event.ratings || event.ratings.length === 0) return 'Not rated'
  const avg = event.ratings.reduce((a, b) => a + b, 0) / event.ratings.length
  return avg.toFixed(1) + ' ★'
}

// 导出已保存的文章为 CSV
const exportSavedArticlesAsCSV = () => {
  exportToCSV(savedArticles.value, 'saved-articles.csv')
}

// 导出已保存的文章为 PDF
const exportSavedArticlesAsPDF = () => {
  exportToPDF(savedArticles.value, 'saved-articles.pdf')
}
</script>

<style scoped>
.dashboard-wrapper {
  background: linear-gradient(135deg, #f8fbff, #f2f8ff);
  min-height: 100vh;
}

.card {
  border-radius: 12px;
  background: linear-gradient(135deg, #fdfaf1, #f4f8ff);
  transition: all 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
</style>
