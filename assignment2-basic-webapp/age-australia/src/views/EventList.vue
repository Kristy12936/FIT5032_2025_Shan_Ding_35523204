<template>
  <div class="event-list-wrapper py-5">
    <div class="container" data-aos="fade-up">
      <h2 class="text-center text-primary mb-5">
        <i class="fas fa-calendar-alt me-2"></i>Upcoming Events
      </h2>

      <!-- 活动卡片 -->
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4"
          v-for="event in sortedEvents"
          :key="event.id"
        >
          <div class="card event-card h-100 shadow-sm" data-aos="zoom-in">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-success">
                <i class="fas fa-star me-2"></i>{{ event.title }}
              </h5>
              <p class="text-muted mb-2">
                <i class="fas fa-clock me-2"></i>
                <strong>Date:</strong> {{ formatDate(event.date) }}
              </p>
              <p class="card-text flex-grow-1">
                {{ event.description || 'No description available.' }}
              </p>
              <router-link
                :to="`/event/${event.id}`"
                class="btn btn-outline-primary btn-sm align-self-start mt-2"
              >
                <i class="fas fa-info-circle me-1"></i>View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 没有活动时 -->
      <p v-if="sortedEvents.length === 0" class="text-center text-muted mt-4">
        No upcoming events.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const events = ref([])

onMounted(() => {
  const eventsRef = collection(db, 'events')
  onSnapshot(eventsRef, (snapshot) => {
    events.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
})

// ✅ 时间格式优化
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ✅ 按时间排序
const sortedEvents = computed(() => {
  return events.value.slice().sort((a, b) => new Date(a.date) - new Date(b.date))
})
</script>

<style scoped>
.event-list-wrapper {
  background: linear-gradient(to right, #f8fbff, #f1f8ff);
  min-height: 100vh;
}

/* 卡片美化 */
.event-card {
  border-radius: 14px;
  background: linear-gradient(145deg, #ffffff, #f2f8ff);
  transition: all 0.3s ease;
}
.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.15);
}

.card-title {
  font-weight: 600;
}

.text-muted {
  font-size: 0.9rem;
}
</style>
