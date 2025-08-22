<template>
  <div class="register-page d-flex justify-content-center align-items-center">
    <div class="register-card shadow p-4 rounded">
      <h2 class="mb-4 text-center text-success">Register</h2>
      <form @submit.prevent="register">
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

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <div v-if="success" class="alert alert-success py-2">{{ success }}</div>

        <button type="submit" class="btn btn-success w-100">Register</button>
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
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()
const authStore = useAuthStore()

const register = async () => {
  error.value = ''
  success.value = ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

  if (!emailRegex.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }

  if (!passwordRegex.test(password.value)) {
    error.value =
      'Password must be at least 8 characters long and contain uppercase, lowercase letters, and a number.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    await authStore.register(email.value, password.value)
    success.value = '🎉 Registration successful. Redirecting...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.'
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 100px); /* 避开导航栏 */
  background: linear-gradient(135deg, #e8f0ff, #f6fbff);
  padding-top: 100px;
}

.register-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  z-index: 10;
  position: relative;
}
</style>
