<template>
  <div class="event-list-wrapper py-5">
    <div class="container" data-aos="fade-up">
      <h2 class="text-center text-primary mb-4">
        <i class="fas fa-calendar-alt me-2"></i>All Events
      </h2>

      <!-- 🔎 搜索框 -->
      <div class="d-flex align-items-center mb-4">
        <i class="fas fa-search me-2" aria-hidden="true"></i>
        <input
          v-model.trim="q"
          type="search"
          class="form-control"
          placeholder="Search by title / description / date"
          aria-label="Search events"
        />
      </div>

      <!-- 活动卡片 -->
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4"
          v-for="event in visibleEvents"
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
      <p v-if="visibleEvents.length === 0" class="text-center text-muted mt-4">
        No events found.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const events = ref([])
const q = ref('') // 🔎 搜索关键字
let unlisten = null

onMounted(() => {
  const eventsRef = collection(db, 'events')
  unlisten = onSnapshot(eventsRef, (snapshot) => {
    events.value = snapshot.docs.map(doc => {
      const d = doc.data() || {}
      return {
        id: doc.id,
        title: d.title || '',
        description: d.description || '',
        date: d.date || '' // 预期 'YYYY-MM-DD'
      }
    })
  })
})
onBeforeUnmount(() => { if (typeof unlisten === 'function') unlisten() })

// 时间格式
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return isNaN(date) ? (dateStr || '') : date.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

// 先按关键字过滤（title/description/date，大小写不敏感）
const filtered = computed(() => {
  const kw = q.value.toLowerCase()
  if (!kw) return events.value
  return events.value.filter(ev =>
    (ev.title && ev.title.toLowerCase().includes(kw)) ||
    (ev.description && ev.description.toLowerCase().includes(kw)) ||
    (ev.date && ev.date.toLowerCase().includes(kw))
  )
})

// 再按日期升序排序
const visibleEvents = computed(() => {
  const arr = [...filtered.value]
  return arr.sort((a, b) => {
    const ta = Date.parse(a.date) || 0
    const tb = Date.parse(b.date) || 0
    return ta - tb
  })
})
</script>

<style scoped>
.event-list-wrapper {
  background: linear-gradient(to right, #f8fbff, #f1f8ff);
  min-height: 100vh;
}
.event-card { border-radius: 14px; background: linear-gradient(145deg, #ffffff, #f2f8ff); transition: all 0.3s ease; }
.event-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 123, 255, 0.15); }
.card-title { font-weight: 600; }
.text-muted { font-size: 0.9rem; }
</style>
