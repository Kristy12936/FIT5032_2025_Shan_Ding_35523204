<template>
  <div class="container py-5" data-aos="fade-up">
    <div v-if="event" class="event-detail-card shadow p-4 rounded" tabindex="0">
      <h2 class="text-primary mb-3" :aria-label="'Event title: ' + event.title">{{ event.title }}</h2>
      <p><strong>Date:</strong> {{ event.date }}</p>
      <p><strong>Description:</strong> {{ event.description }}</p>
      <p><strong>Participants:</strong> {{ event.participants?.length || 0 }}</p>
      <p><strong>Average Rating:</strong> {{ averageRating }} ⭐</p>

      <!-- ✅ 参加活动按钮 -->
      <button
        @click="joinEvent"
        class="btn btn-outline-success mt-3"
        :disabled="hasJoined"
        :aria-disabled="hasJoined ? 'true' : 'false'"
        :aria-label="hasJoined ? 'You have already joined this event' : 'Join event'">
        {{ hasJoined ? 'Already Joined' : 'Join Event' }}
      </button>

      <!-- ✅ 用户评分 -->
      <div class="rating-section mt-4">
        <h5 class="mb-2">Your Rating:</h5>
        <div class="stars mb-3">
          <i
            v-for="star in 5"
            :key="star"
            class="fas fa-star"
            :class="{ active: star <= userRating }"
            @click="setRating(star)"
            role="button"
            :aria-pressed="star <= userRating ? 'true' : 'false'"
            :aria-label="'Rate ' + star + ' stars'"></i>
        </div>
        <button class="btn btn-success" @click="submitRating" :disabled="submitted" :aria-disabled="submitted ? 'true' : 'false'">
          {{ submitted ? 'Submitted' : 'Submit Rating' }}
        </button>
      </div>
    </div>

    <div v-else class="text-center text-muted">Loading event...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from '../store/auth'

const route = useRoute()
const auth = useAuthStore()
const user = computed(() => auth.user)

const event = ref(null)
const userRating = ref(0)
const submitted = ref(false)
const averageRating = ref('Not rated')
const hasJoined = ref(false) // ✅ 是否已参加活动

// 初始化
onMounted(async () => {
  const id = route.params.id
  const docRef = doc(db, 'events', id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    event.value = { id, ...docSnap.data() }
    calculateAverage()

    // 检查用户是否已参加
    if (user.value && event.value.participants?.includes(user.value.email)) {
      hasJoined.value = true
    }
  }
})

// 评分逻辑
const setRating = (value) => {
  userRating.value = value
}

const submitRating = async () => {
  if (!user.value || !event.value) return

  const newRatings = [...(event.value.ratings || []), userRating.value]
  const eventRef = doc(db, 'events', event.value.id)

  try {
    await updateDoc(eventRef, {
      ratings: newRatings
    })
    submitted.value = true
    event.value.ratings = newRatings
    calculateAverage()
    alert('✅ Thank you for your rating!')
  } catch (err) {
    alert('Failed to submit rating.')
  }
}

const calculateAverage = () => {
  if (!event.value?.ratings || event.value.ratings.length === 0) {
    averageRating.value = 'Not rated'
    return
  }
  const sum = event.value.ratings.reduce((a, b) => a + b, 0)
  averageRating.value = (sum / event.value.ratings.length).toFixed(1)
}

// 加入活动逻辑
const joinEvent = async () => {
  if (!user.value || !event.value) {
    alert('❌ Please log in to join this event.')
    return
  }

  const eventRef = doc(db, 'events', event.value.id)
  const currentParticipants = event.value.participants || []

  if (!currentParticipants.includes(user.value.email)) {
    const updated = [...currentParticipants, user.value.email]
    try {
      await updateDoc(eventRef, { participants: updated })
      event.value.participants = updated
      hasJoined.value = true
      alert('🎉 Successfully joined the event!')
    } catch (err) {
      console.error('🔥 Failed to update:', err)
      alert('❌ Failed to join event.')
    }
  } else {
    hasJoined.value = true
    alert('⚠️ You have already joined this event.')
  }
}
</script>

<style scoped>
.event-detail-card {
  background: #ffffffdd;
  border-radius: 16px;
}

.stars i {
  font-size: 1.8rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s;
}

.stars i.active {
  color: #fbc02d;
}

button:disabled {
  cursor: not-allowed;
}

button:disabled, .stars i[aria-pressed="true"] {
  opacity: 0.5;
}
</style>
