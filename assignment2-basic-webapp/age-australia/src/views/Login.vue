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
            placeholder="Enter your email"
            autocomplete="email"
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
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </div>

        <div v-if="authStore.error" class="alert alert-danger py-2">
          <i class="fas fa-exclamation-circle me-2"></i>{{ authStore.error }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-100 py-2 fw-semibold"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ authStore.loading ? 'Signing in...' : 'Login' }}
        </button>

        <div class="text-center mt-3">
          <router-link to="/register" class="text-decoration-none text-muted small">
            Don't have an account? Sign up
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
const email = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  authStore.clearError()
})

const handleLogin = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

  if (!emailRegex.test(email.value)) {
    authStore.error = 'Please enter a valid email address.'
    return
  }

  if (!passwordRegex.test(password.value)) {
    authStore.error = 'Password must be at least 8 characters and contain uppercase, lowercase letters, and a number.'
    return
  }

  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 100px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
  position: relative;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  transform: none;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
</style>