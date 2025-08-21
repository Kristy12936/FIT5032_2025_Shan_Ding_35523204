<template>
  <div class="admin-panel-page py-5">
    <div class="container" data-aos="fade-up">
     
      <div class="admin-card shadow-sm p-4 mb-5">
        <h2 class="text-success"><i class="fas fa-tools me-2"></i>Admin Panel</h2>

        <div v-if="user?.role === 'admin'">
          <h4 class="mt-4"><i class="fas fa-plus-circle me-2 text-primary"></i>Create New Event</h4>
          <form @submit.prevent="addEvent" class="mb-4">
            <input
              type="text"
              v-model="newEvent.title"
              class="form-control mb-2"
              placeholder="Title"
              required
            />
            <input
              type="date"
              v-model="newEvent.date"
              class="form-control mb-2"
              required
            />
            <textarea
              v-model="newEvent.description"
              class="form-control mb-2"
              placeholder="Description"
              required
            ></textarea>
            <button type="submit" class="btn btn-success">
              <i class="fas fa-plus me-1"></i>Create
            </button>
          </form>
        </div>
        <p v-else class="text-danger">You are not authorized to access this page.</p>
      </div>

      <!-- 活动列表 -->
      <div v-if="events.length">
        <h4 class="mb-4 text-primary"><i class="fas fa-list me-2"></i>Existing Events</h4>
        <div class="row">
          <div
            class="col-md-6 col-lg-4 mb-4"
            v-for="e in events"
            :key="e.id"
          >
            <div class="card event-card h-100 shadow-sm border-0">
              <div class="card-body">
                <h5 class="card-title text-dark">{{ e.title }}</h5>
                <p class="card-text text-muted"><strong>Date:</strong> {{ e.date }}</p>
                <p class="card-text">{{ e.description }}</p>
                <p class="text-muted mb-1">👥 Participants: {{ e.participants?.length || 0 }}</p>
                <p class="text-muted mb-0">⭐ Avg Rating:
                  <span class="text-warning fw-bold">{{ getAverageRating(e) }}</span>
                </p>
              </div>
              <div class="card-footer bg-white border-0 text-end">
                <button class="btn btn-outline-danger btn-sm" @click="deleteEvent(e.id)">
                  <i class="fas fa-trash-alt me-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-muted mt-5">
        <p>No events available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('user'))
const events = ref([])
const newEvent = ref({ title: '', date: '', description: '' })

onMounted(() => {
  const storedEvents = JSON.parse(localStorage.getItem('events')) || []
  events.value = storedEvents
})

const addEvent = () => {
  const id = Date.now()
  const event = {
    id,
    title: newEvent.value.title,
    date: newEvent.value.date,
    description: newEvent.value.description,
    participants: [],
    ratings: [],
  }
  events.value.push(event)
  localStorage.setItem('events', JSON.stringify(events.value))
  newEvent.value = { title: '', date: '', description: '' }
  alert('✅ Event created and saved to localStorage!')
}

const deleteEvent = (id) => {
  events.value = events.value.filter(e => e.id !== id)
  localStorage.setItem('events', JSON.stringify(events.value))
  alert('🗑️ Event deleted!')
}

const getAverageRating = (event) => {
  if (!event.ratings || event.ratings.length === 0) return 'Not rated'
  const sum = event.ratings.reduce((a, b) => a + b, 0)
  return (sum / event.ratings.length).toFixed(1) + ' ★'
}
</script>

<style scoped>
.admin-panel-page {
  background: linear-gradient(to right, #e3f2fd, #fdfdff);
  min-height: 100vh;
}

.admin-card {
  background: linear-gradient(135deg, #ffffff, #f4f8ff);
  border-radius: 16px;
}

.event-card {
  border-radius: 16px;
  background: linear-gradient(135deg, #fdfaf1, #f4f8ff);
  transition: transform 0.3s ease-in-out;
}
.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
</style>
