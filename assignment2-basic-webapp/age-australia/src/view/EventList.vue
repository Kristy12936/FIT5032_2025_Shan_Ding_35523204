// src/views/EventList.vue
<template>
  <div class="container">
    <h2 class="mb-4">Community Events</h2>
    <div v-if="events.length" class="row">
      <div class="col-md-6 mb-3" v-for="event in events" :key="event.id">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ event.title }}</h5>
            <p class="card-text">Date: {{ event.date }}</p>
            <p class="card-text">{{ event.description }}</p>
            <p class="card-text">Participants: {{ event.participants?.length || 0 }}</p>
            <p class="card-text">Average Rating: {{ calculateAverage(event.ratings) }}</p>
            <button class="btn btn-primary" @click="register(event)" :disabled="hasJoined(event)">
              {{ hasJoined(event) ? 'Registered' : 'Join Event' }}
            </button>
            <router-link :to="`/events/${event.id}`" class="btn btn-link">View Detail</router-link>
          </div>
        </div>
      </div>
    </div>
    <p v-else>No events available at the moment.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const events = ref([])
const user = JSON.parse(localStorage.getItem('user'))
const router = useRouter()

onMounted(() => {
  events.value = JSON.parse(localStorage.getItem('events')) || []
})

const hasJoined = (event) => {
  return event.participants?.includes(user?.email)
}

const register = (event) => {
  if (!user) {
    router.push('/login')
    return
  }
  if (!event.participants) event.participants = []
  if (!event.participants.includes(user.email)) {
    event.participants.push(user.email)
    const updatedEvents = events.value.map(e => e.id === event.id ? event : e)
    events.value = updatedEvents
    localStorage.setItem('events', JSON.stringify(updatedEvents))
  }
}

const calculateAverage = (ratings) => {
  if (!ratings || ratings.length === 0) return 'Not rated yet'
  const sum = ratings.reduce((a, b) => a + b, 0)
  return (sum / ratings.length).toFixed(1)
}
</script>
