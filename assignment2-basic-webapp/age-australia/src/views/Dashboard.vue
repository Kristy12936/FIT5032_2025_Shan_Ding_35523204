<template>
  <div class="dashboard-wrapper py-5">
    <div class="container" data-aos="fade-up">
      <!-- 用户信息卡 -->
      <div class="card p-4 shadow-sm border-0 mb-5">
        <h2 class="mb-3 text-primary"><i class="fas fa-user-circle me-2"></i>My Dashboard</h2>
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p>
          <strong>Role:</strong>
          <span class="badge" :class="user.role === 'admin' ? 'bg-danger' : 'bg-secondary'">
            {{ user.role }}
          </span>
        </p>
      </div>

      <!-- 注册活动 -->
      <div class="mb-5">
        <h4 class="mb-3"><i class="fas fa-calendar-check me-2 text-success"></i>Registered Events</h4>
        <div v-if="registeredEvents.length" class="row g-4">
          <div class="col-md-6" v-for="event in registeredEvents" :key="event.id">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">{{ event.title }}</h5>
                <p><strong>Date:</strong> {{ event.date }}</p>
                <p>{{ event.description }}</p>
                <p><strong>Avg Rating:</strong> {{ getAvgRating(event) }}</p>

                <div class="mt-2">
                  <label class="form-label">Your Rating:</label>
                  <select class="form-select w-auto d-inline-block ms-2" v-model="userRatings[event.id]">
                    <option disabled value="">Select</option>
                    <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
                  </select>
                  <button class="btn btn-sm btn-outline-primary ms-2" @click="submitRating(event)">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-muted">You haven't joined any events yet.</p>
      </div>

      <!-- 收藏文章 -->
      <div>
        <h4 class="mb-3"><i class="fas fa-star me-2 text-warning"></i>Saved Articles</h4>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const events = JSON.parse(localStorage.getItem('events') || '[]')
const articles = ref([])
const registeredEvents = ref([])
const savedArticles = ref([])
const userRatings = ref({})

onMounted(async () => {
  registeredEvents.value = events.filter(e => e.participants?.includes(user.email))

  user.ratedEvents?.forEach(r => {
    userRatings.value[r.eventId] = r.rating
  })

  const allArticles = await fetch('/articles.json').then(r => r.json())
  savedArticles.value = allArticles.filter(a => user.favorites?.includes(a.id))
})

const getAvgRating = (event) => {
  if (!event.ratings || event.ratings.length === 0) return 'Not rated'
  const avg = event.ratings.reduce((a, b) => a + b, 0) / event.ratings.length
  return avg.toFixed(1) + ' ★'
}

const submitRating = (event) => {
  const rating = parseInt(userRatings.value[event.id])
  if (!rating || rating < 1 || rating > 5) {
    alert('Please select a rating between 1 and 5.')
    return
  }

  event.ratings = event.ratings || []
  event.ratings.push(rating)

  const updatedEvents = events.map(e => e.id === event.id ? event : e)
  localStorage.setItem('events', JSON.stringify(updatedEvents))

  user.ratedEvents = user.ratedEvents || []
  const existing = user.ratedEvents.find(r => r.eventId === event.id)
  if (existing) {
    existing.rating = rating
  } else {
    user.ratedEvents.push({ eventId: event.id, rating })
  }
  localStorage.setItem('user', JSON.stringify(user))
  alert('✅ Rating submitted!')
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
