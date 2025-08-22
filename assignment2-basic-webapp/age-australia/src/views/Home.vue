<template>
  <div class="container py-5">
    <!-- ✅ 推荐文章 -->
    <section class="mb-4" data-aos="fade-up">
      <h3>Today's Featured Articles</h3>
      <div class="row">
        <!-- 显示更多文章 -->
        <div class="col-md-4" v-for="article in featuredArticles.slice(0, articlesToShow)" :key="article.id">
          <div class="card h-100">
            <img :src="article.image" :alt="`Image for ${article.title}`" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ article.title }}</h5>
              <p class="card-text text-truncate">{{ article.content }}</p>
              <router-link 
                class="btn btn-outline-primary btn-sm" 
                :to="`/articles/${article.id}`" 
                aria-label="Read more about the article">
                Read More
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <!-- 显示更多按钮 -->
      <div class="text-center mt-4">
        <button class="btn btn-primary" @click="loadMoreArticles" v-if="articlesToShow < featuredArticles.length">Load More</button>
      </div>
    </section>

    <!-- ✅ 即将开始的活动（来自 Firebase） -->
    <section data-aos="fade-up">
      <h3>Upcoming Events</h3>
      <div class="row">
        <div class="col-md-4" v-for="event in upcomingEvents" :key="event.id">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ event.title }}</h5>
              <p><strong>Date:</strong> {{ event.date }}</p>
              <router-link 
                :to="`/event/${event.id}`" 
                class="btn btn-success btn-sm" 
                aria-label="View details of the event">
                View Details
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="upcomingEvents.length === 0" class="text-muted text-center mt-4">
          No upcoming events.
        </div>
      </div>
    </section>

    <!-- ✅ 导出按钮 -->
    <div class="text-center mt-4">
      <button @click="handleExportCSV" class="btn btn-primary me-3" v-if="featuredArticles.length > 0">Export as CSV</button>
      <button @click="handleExportPDF" class="btn btn-secondary" v-if="featuredArticles.length > 0">Export as PDF</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { exportToCSV, exportToPDF } from '@/utils/exportUtils'  // 导入导出函数
import { toRaw } from 'vue'

// ✅ 本地文章展示
const featuredArticles = ref([
  { 
    id: 1, 
    title: "Healthy Eating Tips for Seniors", 
    content: "Discover how a balanced diet can support you...", 
    image: new URL('@/assets/images/healthy-eating.jpg', import.meta.url).href 
  },
  { 
    id: 2, 
    title: "Gentle Exercises for Joint Health", 
    content: "Low-impact movements to improve flexibility...", 
    image: new URL('@/assets/images/gentle-exercises.jpg', import.meta.url).href 
  },
  { 
    id: 3, 
    title: "Staying Connected: Social Wellness", 
    content: "Tips on staying socially active and emotionally connected...", 
    image: new URL('@/assets/images/staying-connected.jpg', import.meta.url).href 
  },
  { 
    id: 4, 
    title: "Mental Health and Well-being", 
    content: "How to maintain mental health and well-being in later life...", 
    image: new URL('@/assets/images/mindfullless.jpg', import.meta.url).href 
  },
  { 
    id: 5, 
    title: "The Importance of Sleep for Seniors", 
    content: "Understanding the significance of sleep in older age...", 
    image: new URL('@/assets/images/sleep-health.jpg', import.meta.url).href 
  },
  { 
    id: 6, 
    title: "Nutrition and Hydration for Seniors", 
    content: "Stay hydrated and eat nutrient-rich foods...", 
    image: new URL('@/assets/images/nutrition.jpg', import.meta.url).href
  },
  { 
    id: 7, 
    title: "Managing Stress and Anxiety", 
    content: "Stress management techniques for seniors...", 
    image: new URL('@/assets/images/stress-management.jpg', import.meta.url).href
  },
  { 
    id: 8, 
    title: "Mindfulness for Seniors", 
    content: "Practices to improve mental clarity and reduce stress...", 
    image: new URL('@/assets/images/community-yoga.jpg', import.meta.url).href
  }
])

// 控制显示文章的数量
const articlesToShow = ref(6)

// ✅ Firestore 活动展示
const upcomingEvents = ref([])

onMounted(async () => {
  // 获取 Firebase 活动数据
  const querySnapshot = await getDocs(collection(db, 'events'))
  const allEvents = []

  querySnapshot.forEach(doc => {
    const data = doc.data()
    allEvents.push({
      id: doc.id,
      ...data
    })
  })

  // 筛选未来的活动
  const now = new Date()
  const futureEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate >= now
  })

  // 按时间排序并取前3个
  futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
  upcomingEvents.value = futureEvents.slice(0, 3)
})

// 加载更多文章
const loadMoreArticles = () => {
  // 每次加载 6 篇文章
  articlesToShow.value += 6
}

// 处理导出为CSV
const handleExportCSV = () => {
  const rawArticles = toRaw(featuredArticles.value) // 转化为普通数组
  console.log("Exporting articles as CSV", rawArticles)
  exportToCSV(rawArticles, 'featured-articles.csv')
}

// 处理导出为PDF
const handleExportPDF = () => {
  const rawArticles = toRaw(featuredArticles.value) // 转化为普通数组
  console.log("Exporting articles as PDF", rawArticles)
  exportToPDF(rawArticles, 'featured-articles.pdf')
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #f3e5f5, #e8f0fe);
  padding: 60px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.card {
  border-radius: 16px;
  background: linear-gradient(145deg, #fdf8f4, #f1f6ff);
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease-in-out;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
.card-img-top {
  border-radius: 16px 16px 0 0;
  object-fit: cover;
  height: 200px;
}
</style>
