// src/views/EventDetail.vue
<template>
  <div class="container">
    <h2 class="mb-4">Event Detail</h2>
    <div v-if="event">
      <h4>{{ event.title }}</h4>
      <p><strong>Date:</strong> {{ event.date }}</p>
      <p>{{ event.description }}</p>
      <p><strong>Participants:</strong> {{ event.participants?.length || 0 }}</p>
      <p><strong>Average Rating:</strong> {{ averageRating }}</p>

      <div v-if="hasJoined">
        <label for="rating">Your Rating:</label>
        <select id="rating" class="form-select w-auto" v-model="userRating">
          <option disabled value="">Select Rating</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>
        <button class="btn btn-success mt-2" @click="submitRating">Submit</button>
      </div>
      <p v-else class="text-muted">You must join the event to rate it.</p>
    </div>
    <p v-else>Event not found.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const events = ref([])
const event = ref(null)
const user = JSON.parse(localStorage.getItem('user'))
const userRating = ref('')

onMounted(() => {
  events.value = JSON.parse(localStorage.getItem('events')) || []
  event.value = events.value.find(e => e.id === parseInt(route.params.id))
  if (!event.value) return
  const existing = user?.ratedEvents?.find(r => r.eventId === event.value.id)
  if (existing) userRating.value = existing.rating
})

const hasJoined = computed(() => {
  return event.value?.participants?.includes(user?.email)
})

const averageRating = computed(() => {
  if (!event.value?.ratings?.length) return 'Not rated yet'
  const sum = event.value.ratings.reduce((a, b) => a + b, 0)
  return (sum / event.value.ratings.length).toFixed(1)
})

const submitRating = () => {
  if (!userRating.value) return alert('Please select a rating')

  event.value.ratings = event.value.ratings || []
  event.value.ratings.push(parseInt(userRating.value))
  const updatedEvents = events.value.map(e => e.id === event.value.id ? event.value : e)
  localStorage.setItem('events', JSON.stringify(updatedEvents))

  user.ratedEvents = user.ratedEvents || []
  const existingIndex = user.ratedEvents.findIndex(r => r.eventId === event.value.id)
  if (existingIndex !== -1) {
    user.ratedEvents[existingIndex].rating = parseInt(userRating.value)
  } else {
    user.ratedEvents.push({ eventId: event.value.id, rating: parseInt(userRating.value) })
  }
  localStorage.setItem('user', JSON.stringify(user))
  alert('Thank you for rating!')
  router.push('/events')
}
</script>
