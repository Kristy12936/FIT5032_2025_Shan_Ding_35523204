<template>
  <div class="login-page d-flex justify-content-center align-items-center">
    <div class="login-card shadow p-4 rounded">
      <h2 class="mb-4 text-center text-primary">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  error.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

  if (!emailRegex.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }

  if (!passwordRegex.test(password.value)) {
    error.value =
      'Password must be at least 8 characters and contain uppercase, lowercase letters, and a number.'
    return
  }

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Login failed. Please try again.'
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 100px); /* 留出顶部导航空间 */
  background: linear-gradient(135deg, #f0f4ff, #e6f7ff);
  padding-top: 100px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  z-index: 10;
  position: relative;
}
</style>
