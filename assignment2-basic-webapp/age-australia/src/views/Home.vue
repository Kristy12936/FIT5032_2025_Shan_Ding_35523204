<template>
  <div class="container py-5" role="main">
    <!-- ✅ Hero + Map CTA -->
    <section class="hero mb-5" data-aos="fade-up" aria-label="Welcome section">
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div class="flex-fill">
          <h2 class="mb-2">Welcome to Age Australia</h2>
          <p class="mb-3">
            Read curated health articles, join community events, and get directions to places near you.
          </p>
          <router-link
            to="/map"
            class="btn btn-primary me-2"
            aria-label="Open map and navigation features"
          >
            Open Map & Navigation
          </router-link>
          <router-link
            to="/articles"
            class="btn btn-outline-secondary"
            aria-label="Browse all health articles"
          >
            Browse Articles
          </router-link>
        </div>
      </div>
    </section>

    <!-- ✅ 推荐文章 -->
    <section class="mb-4" data-aos="fade-up" aria-label="Featured articles">
      <h3 class="mb-3">Today's Featured Articles</h3>
      <div class="row" role="list">
        <div
          class="col-md-4 mb-4"
          v-for="article in featuredArticles.slice(0, articlesToShow)"
          :key="article.id"
          role="listitem"
        >
          <div class="card h-100">
            <img
              :src="article.image"
              :alt="`Image for ${article.title}`"
              class="card-img-top"
              loading="lazy"
            />
            <div class="card-body">
              <h5 class="card-title">{{ article.title }}</h5>
              <p class="card-text text-truncate" :aria-label="article.content">
                {{ article.content }}
              </p>
              <router-link
                class="btn btn-outline-primary btn-sm"
                :to="`/articles/${article.id}`"
                :aria-label="`Read more about ${article.title}`"
              >
                Read More
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 显示更多按钮 -->
      <div class="text-center mt-2">
        <button
          class="btn btn-primary"
          @click="loadMoreArticles"
          v-if="articlesToShow < featuredArticles.length"
          aria-label="Load more featured articles"
        >
          Load More
        </button>
      </div>
    </section>

    <!-- ✅ 即将开始的活动（来自 Firebase） -->
    <section data-aos="fade-up" aria-label="Upcoming events">
      <h3 class="mb-3">Upcoming Events</h3>
      <div class="row" role="list">
        <div class="col-md-4 mb-4" v-for="event in upcomingEvents" :key="event.id" role="listitem">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ event.title }}</h5>
              <p class="mb-2">
                <strong>Date:</strong>
                <time :datetime="event.date">{{ event.date }}</time>
              </p>
              <router-link
                :to="`/event/${event.id}`"
                class="btn btn-success btn-sm"
                :aria-label="`View details of event ${event.title}`"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>

        <div v-if="upcomingEvents.length === 0" class="text-muted text-center mt-2" role="status">
          No upcoming events.
        </div>
      </div>
    </section>

    <!-- ✅ 导出按钮 -->
    <div class="text-center mt-4" aria-label="Export actions">
      <button
        @click="handleExportCSV"
        class="btn btn-primary me-3"
        v-if="featuredArticles.length > 0"
        aria-label="Export featured articles as CSV"
      >
        Export as CSV
      </button>
      <button
        @click="handleExportPDF"
        class="btn btn-secondary"
        v-if="featuredArticles.length > 0"
        aria-label="Export featured articles as PDF"
      >
        Export as PDF
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { exportToCSV, exportToPDF } from '@/utils/exportUtils'

// ✅ 本地文章展示
const featuredArticles = ref([
  {
    id: 1,
    title: 'Healthy Eating Tips for Seniors',
    content: 'Discover how a balanced diet can support you...',
    image: new URL('@/assets/images/healthy-eating.jpg', import.meta.url).href
  },
  {
    id: 2,
    title: 'Gentle Exercises for Joint Health',
    content: 'Low-impact movements to improve flexibility...',
    image: new URL('@/assets/images/gentle-exercises.jpg', import.meta.url).href
  },
  {
    id: 3,
    title: 'Staying Connected: Social Wellness',
    content: 'Tips on staying socially active and emotionally connected...',
    image: new URL('@/assets/images/staying-connected.jpg', import.meta.url).href
  },
  {
    id: 4,
    title: 'Mental Health and Well-being',
    content: 'How to maintain mental health and well-being in later life...',
    image: new URL('@/assets/images/mindfullless.jpg', import.meta.url).href
  },
  {
    id: 5,
    title: 'The Importance of Sleep for Seniors',
    content: 'Understanding the significance of sleep in older age...',
    image: new URL('@/assets/images/sleep-health.jpg', import.meta.url).href
  },
  {
    id: 6,
    title: 'Nutrition and Hydration for Seniors',
    content: 'Stay hydrated and eat nutrient-rich foods...',
    image: new URL('@/assets/images/nutrition.jpg', import.meta.url).href
  },
  {
    id: 7,
    title: 'Managing Stress and Anxiety',
    content: 'Stress management techniques for seniors...',
    image: new URL('@/assets/images/stress-management.jpg', import.meta.url).href
  },
  {
    id: 8,
    title: 'Mindfulness for Seniors',
    content: 'Practices to improve mental clarity and reduce stress...',
    image: new URL('@/assets/images/community-yoga.jpg', import.meta.url).href
  }
])

// 控制显示文章的数量
const articlesToShow = ref(6)

// ✅ Firestore 活动展示
const upcomingEvents = ref([])

onMounted(async () => {
  try {
    const snap = await getDocs(collection(db, 'events'))
    const allEvents = []
    snap.forEach(d => {
      const data = d.data()
      allEvents.push({ id: d.id, ...data })
    })

    // 筛选未来的活动
    const now = new Date()
    const futureEvents = allEvents.filter(ev => {
      const eventDate = new Date(ev.date)
      return !Number.isNaN(eventDate.getTime()) && eventDate >= now
    })

    // 按时间排序并取前3个
    futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
    upcomingEvents.value = futureEvents.slice(0, 3)
  } catch (e) {
    console.error('Failed to load events:', e)
    upcomingEvents.value = []
  }
})

// 加载更多文章（每次 +6）
const loadMoreArticles = () => {
  articlesToShow.value = Math.min(articlesToShow.value + 6, featuredArticles.value.length)
}

// 处理导出为 CSV
const handleExportCSV = () => {
  const rawArticles = toRaw(featuredArticles.value)
  exportToCSV(rawArticles, 'featured-articles.csv')
}

// 处理导出为 PDF
const handleExportPDF = () => {
  const rawArticles = toRaw(featuredArticles.value)
  exportToPDF(rawArticles, 'featured-articles.pdf')
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #f3e5f5, #e8f0fe);
  padding: 32px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.card {
  border-radius: 16px;
  background: linear-gradient(145deg, #fdf8f4, #f1f6ff);
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
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
