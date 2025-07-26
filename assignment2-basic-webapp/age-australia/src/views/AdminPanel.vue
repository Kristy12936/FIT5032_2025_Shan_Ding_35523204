// src/views/AdminPanel.vue
<template>
  <div class="admin-panel container">
    <h1>Admin Panel</h1>

    <div class="admin-actions">
      <h2>Create New Event</h2>
      <form @submit.prevent="createEvent" class="event-form">
        <div class="mb-3">
          <label for="title" class="form-label">Event Title</label>
          <input type="text" id="title" v-model="newEvent.title" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="date" class="form-label">Event Date</label>
          <input type="date" id="date" v-model="newEvent.date" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea id="description" v-model="newEvent.description" class="form-control" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Create Event</button>
      </form>
    </div>

    <div class="event-list mt-5">
      <h2>Manage Events</h2>
      <div v-if="events.length">
        <div v-for="event in events" :key="event.id" class="border rounded p-3 mb-3">
          <h5>{{ event.title }}</h5>
          <p>Date: {{ event.date }}</p>
          <p>Participants: {{ event.participants?.length || 0 }}</p>
          <p>Average Rating: {{ calculateAverage(event.ratings) }}</p>
          <button class="btn btn-danger btn-sm" @click="deleteEvent(event.id)">Delete</button>
        </div>
      </div>
      <p v-else>No events created yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = JSON.parse(localStorage.getItem('user'))
if (!user || user.role !== 'admin') {
  alert('Unauthorized')
  router.push('/')
}

const newEvent = ref({ title: '', date: '', description: '' })
const events = ref([])

onMounted(() => {
  events.value = JSON.parse(localStorage.getItem('events')) || []
})

const createEvent = () => {
  const event = {
    id: Date.now(),
    ...newEvent.value,
    participants: [],
    ratings: []
  }
  events.value.push(event)
  localStorage.setItem('events', JSON.stringify(events.value))
  newEvent.value = { title: '', date: '', description: '' }
}

const deleteEvent = (id) => {
  events.value = events.value.filter(e => e.id !== id)
  localStorage.setItem('events', JSON.stringify(events.value))
}

const calculateAverage = (ratings) => {
  if (!ratings?.length) return 'Not rated yet'
  const sum = ratings.reduce((a, b) => a + b, 0)
  return (sum / ratings.length).toFixed(1)
}
</script>