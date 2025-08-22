<!-- /src/views/AdminPanel.vue -->
<template>
  <div class="container py-5" data-aos="fade-up">
    <h2 class="text-primary mb-4">Admin Panel - Manage Events</h2>

    <!-- 只有管理员可见（用邮箱判断，不再依赖 user.role） -->
    <div v-if="isAdmin">
      <!-- 创建活动 -->
      <form @submit.prevent="createEvent" class="p-3 border rounded bg-light mb-5">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input v-model="form.title" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Date</label>
          <input v-model="form.date" type="date" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea v-model="form.description" class="form-control" rows="3" required></textarea>
        </div>

        <button type="submit" class="btn btn-success">Create Event</button>
      </form>

      <!-- 活动列表（实时） -->
      <h4 class="mb-3">All Events</h4>
      <div v-if="events.length">
        <div
          v-for="e in events"
          :key="e.id"
          class="list-group-item d-flex justify-content-between align-items-center mb-2 border rounded p-3"
        >
          <div>
            <div class="fw-bold">{{ e.title }}</div>
            <div class="text-muted">Date: {{ e.date }}</div>
          </div>
          <button class="btn btn-outline-danger btn-sm" @click="deleteEvent(e.id)">Delete</button>
        </div>
      </div>
      <div v-else class="text-muted">No events found.</div>
    </div>

    <div v-else class="alert alert-warning">You are not authorized to access this page.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
const user = computed(() => auth.user)

// ✅ 用邮箱判断管理员（和你导航一致）
const isAdmin = computed(() => user.value?.email === 'admin@age.com')

// 表单
const form = ref({
  title: '',
  date: '',
  description: '',
})

// 实时活动列表
const events = ref([])

onMounted(() => {
  const colRef = collection(db, 'events')
  onSnapshot(colRef, snap => {
    events.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })
})

// ✅ 函数名与表单 @submit 保持一致：createEvent
const createEvent = async () => {
  if (!isAdmin.value) return

  const payload = {
    title: form.value.title.trim(),
    date: form.value.date,
    description: form.value.description.trim(),
    participants: [],
    ratings: [],
    createdAt: serverTimestamp(),
  }

  if (!payload.title || !payload.date || !payload.description) return

  try {
    await addDoc(collection(db, 'events'), payload)
    // 清空表单
    form.value = { title: '', date: '', description: '' }
    alert('✅ Event created successfully!')
  } catch (err) {
    console.error('Create failed:', err)
    alert('❌ Failed to create event.')
  }
}

const deleteEvent = async (id) => {
  if (!isAdmin.value) return
  try {
    await deleteDoc(doc(db, 'events', id))
  } catch (err) {
    console.error('Delete failed:', err)
    alert('❌ Failed to delete.')
  }
}
</script>

<style scoped>
.list-group-item { background: #fff; }
</style>
