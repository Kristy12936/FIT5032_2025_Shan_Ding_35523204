<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-center" data-aos="fade-up">🌟 Community Events</h2>

    <div v-if="events.length" class="row">
      <div 
        class="col-md-6 col-lg-4 mb-4" 
        v-for="event in events" 
        :key="event.id" 
        data-aos="fade-up" 
        data-aos-delay="100"
      >
        <div class="card h-100 shadow-sm border-0">
          <img 
            :src="event.image || defaultImage" 
            class="card-img-top" 
            alt="event" 
            style="height: 180px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ event.title }}</h5>
            <p class="card-text"><strong>Date:</strong> {{ event.date }}</p>
            <p class="card-text">{{ event.description }}</p>
            <p class="card-text text-muted">👥 Participants: {{ event.participants?.length || 0 }}</p>
            <p class="card-text text-muted">⭐ Avg Rating: {{ calculateAverage(event.ratings) }}</p>
          </div>
          <div class="card-footer bg-white border-0 d-flex justify-content-between px-3 pb-3">
            <button 
              class="btn btn-outline-primary btn-sm" 
              @click="register(event)" 
              :disabled="hasJoined(event)">
              {{ hasJoined(event) ? '✅ Registered' : 'Join Event' }}
            </button>
            <router-link :to="`/event/${event.id}`" class="btn btn-sm btn-secondary">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else data-aos="fade-in" class="text-center">
      <p>No events available at the moment.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const events = ref([])
const router = useRouter()
const defaultImage = '/banner-default.jpg'

const user = computed(() => JSON.parse(localStorage.getItem('user')))

onMounted(async () => {
  const cached = JSON.parse(localStorage.getItem('events'))
  if (cached && cached.length) {
    events.value = cached
  } else {
    const res = await fetch('/events.json')
    const fetched = await res.json()
    events.value = fetched
    localStorage.setItem('events', JSON.stringify(fetched))
  }

  // 添加默认图片（如果没有 image 字段）
  events.value.forEach(e => {
    if (!e.image) e.image = defaultImage
  })
})

const hasJoined = (event) => {
  return event.participants?.includes(user.value?.email)
}

const register = (event) => {
  if (!user.value) {
    router.push('/login')
    return
  }

  if (!event.participants) event.participants = []
  if (!event.participants.includes(user.value.email)) {
    event.participants.push(user.value.email)
    const updated = events.value.map(e => e.id === event.id ? event : e)
    events.value = updated
    localStorage.setItem('events', JSON.stringify(updated))
    alert('🎉 Successfully joined the event!')
  }
}

const calculateAverage = (ratings) => {
  if (!ratings || ratings.length === 0) return 'Not rated yet'
  const sum = ratings.reduce((acc, r) => acc + r, 0)
  return (sum / ratings.length).toFixed(1)
}
</script>

<style scoped>
.card {
  border-radius: 16px;
  background: linear-gradient(145deg, #fdf8f4, #f1f6ff); /* 🌈 淡暖渐变 */
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

</style>
