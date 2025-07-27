<template>
  <div class="container py-5">
    <!-- ✅ 包一层 .hero 背景卡片 -->
    <div class="hero text-center mb-5" data-aos="zoom-in">
      <h1 class="display-5">Welcome to EmpowerAge</h1>
      <p class="lead">A trusted place for health, connection and support for older adults</p>
    </div>

    <!-- Featured Articles -->
    <section class="mb-4" data-aos="fade-up">
      <h3>Today's Featured Articles</h3>
      <div class="row">
        <div class="col-md-4" v-for="article in featuredArticles" :key="article.id">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ article.title }}</h5>
              <p class="card-text text-truncate">{{ article.content }}</p>
              <router-link class="btn btn-outline-primary btn-sm" :to="'/articles'">Read More</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section data-aos="fade-up">
      <h3>Upcoming Events</h3>
      <div class="row">
        <div class="col-md-4" v-for="event in upcomingEvents" :key="event.id">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ event.title }}</h5>
              <p><strong>Date:</strong> {{ event.date }}</p>
              <router-link :to="`/event/${event.id}`" class="btn btn-success btn-sm">View Details</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const featuredArticles = ref([])
const upcomingEvents = ref([])

onMounted(async () => {
  const articles = await fetch('/src/assets/data/articles.json').then(r => r.json())
  featuredArticles.value = articles.slice(0, 3)

  const events = await fetch('/src/assets/data/events.json').then(r => r.json())
  upcomingEvents.value = events.slice(0, 3)
})
</script>

<style scoped>
/* ✅ 欢迎卡片样式 */
.hero {
  background: linear-gradient(135deg, #f3e5f5, #e8f0fe); /* 淡紫+淡蓝 */
  padding: 60px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* ✅ 卡片样式优化 */
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
</style>
