<!-- /src/views/EventDetail.vue -->
<template>
  <div class="container py-4">
    <h2>Event Details</h2>
    <div v-if="event">
      <h4>{{ event.title }}</h4>
      <p><strong>Date:</strong> {{ event.date }}</p>
      <p>{{ event.description }}</p>
      <p><strong>Average Rating:</strong> {{ averageRating }}</p>

      <div v-if="hasJoined">
        <label class="form-label">Your Rating:</label>
        <select class="form-select w-auto" v-model="userRating">
          <option disabled value="">Select</option>
          <option v-for="n in 5" :key="n">{{ n }}</option>
        </select>
        <button class="btn btn-success mt-2" @click="submitRating">Submit</button>
      </div>
      <div v-else>
        <button class="btn btn-primary" @click="register">Join Event</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const event = ref(null)
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userRating = ref('')

onMounted(async () => {
  const events = await fetch('/src/assets/data/events.json').then(r => r.json())
  event.value = events.find(e => e.id === parseInt(route.params.id))
  const rated = user?.ratedEvents?.find(r => r.eventId === event.value?.id)
  if (rated) userRating.value = rated.rating
})

const hasJoined = computed(() => event.value?.participants?.includes(user?.email))

const averageRating = computed(() => {
  if (!event.value?.ratings?.length) return 'Not rated'
  const sum = event.value.ratings.reduce((a, b) => a + b, 0)
  return (sum / event.value.ratings.length).toFixed(1)
})

const register = () => {
  event.value.participants = event.value.participants || []
  if (!event.value.participants.includes(user.email)) {
    event.value.participants.push(user.email)
    alert('You have successfully registered!')
  }
}

const submitRating = () => {
  event.value.ratings = event.value.ratings || []
  event.value.ratings.push(parseInt(userRating.value))
  user.ratedEvents = user.ratedEvents || []
  const existing = user.ratedEvents.find(r => r.eventId === event.value.id)
  if (existing) {
    existing.rating = parseInt(userRating.value)
  } else {
    user.ratedEvents.push({ eventId: event.value.id, rating: parseInt(userRating.value) })
  }
  localStorage.setItem('user', JSON.stringify(user))
  alert('Thank you for your feedback!')
}
</script>
