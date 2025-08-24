<template>
  <div class="register-page d-flex justify-content-center align-items-center">
    <div class="register-card shadow p-4 rounded">
      <h2 class="mb-4 text-center text-success">Create Account</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="displayName" class="form-label">Display Name (Optional)</label>
          <input
            v-model="displayName"
            type="text"
            class="form-control"
            id="displayName"
            placeholder="Enter your display name"
            autocomplete="name"
          />
        </div>

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
            placeholder="Create a password (min 8 characters)"
            autocomplete="new-password"
            minlength="8"
          />
          <div class="form-text">Password must be at least 8 characters with uppercase, lowercase, and number</div>
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            id="confirmPassword"
            required
            placeholder="Confirm your password"
            autocomplete="new-password"
            minlength="8"
          />
        </div>

        <div v-if="authStore.error" class="alert alert-danger py-2">
          <i class="fas fa-exclamation-circle me-2"></i>{{ authStore.error }}
        </div>

        <div v-if="successMessage" class="alert alert-success py-2">
          <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
        </div>

        <div v-if="password !== confirmPassword && confirmPassword" class="alert alert-warning py-2">
          <i class="fas fa-exclamation-triangle me-2"></i>Passwords do not match
        </div>

        <button 
          type="submit" 
          class="btn btn-success w-100 py-2 fw-semibold"
          :disabled="authStore.loading || password !== confirmPassword"
        >
          <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ authStore.loading ? 'Creating account...' : 'Register' }}
        </button>

        <div class="text-center mt-3">
          <router-link to="/login" class="text-decoration-none text-muted small">
            Already have an account? Sign in
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

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const successMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  authStore.clearError()
})

const handleRegister = async () => {
  authStore.clearError()
  successMessage.value = ''

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

  if (password.value !== confirmPassword.value) {
    authStore.error = 'Passwords do not match'
    return
  }

  const result = await authStore.register(email.value, password.value, displayName.value)
  
  if (result.success) {
    successMessage.value = '🎉 Registration successful! Redirecting to login...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}
</script>

<style scoped>
.register-page {
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding-top: 100px;
}

.register-card {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
  position: relative;
}

.btn-success {
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
  transition: all 0.3s ease;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
}

.btn-success:disabled {
  opacity: 0.6;
  transform: none;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
</style>