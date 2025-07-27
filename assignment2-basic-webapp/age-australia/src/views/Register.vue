<template>
  <div class="container d-flex justify-content-center align-items-center mt-5" data-aos="fade-down">
    <div class="card shadow-lg p-4 border-0" style="min-width: 450px;">
      <h3 class="text-center text-success mb-4">
        <i class="fas fa-user-plus me-2"></i>Create Your Account
      </h3>

      <form @submit.prevent="register">
        <div class="mb-3">
          <label class="form-label">
            <i class="fas fa-user me-2 text-secondary"></i>Name
          </label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            required
            placeholder="Your name"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">
            <i class="fas fa-envelope me-2 text-secondary"></i>Email
          </label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            required
            placeholder="you@example.com"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">
            <i class="fas fa-lock me-2 text-secondary"></i>Password
          </label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            required
            placeholder="Minimum 6 characters"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">
            <i class="fas fa-check-circle me-2 text-secondary"></i>Confirm Password
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            required
            placeholder="Re-enter password"
          />
        </div>

        <button type="submit" class="btn btn-success w-100">
          <i class="fas fa-user-plus me-2"></i>Register
        </button>
      </form>

      <div v-if="error" class="alert alert-danger mt-3">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
      </div>

      <div v-if="success" class="alert alert-success mt-3">
        <i class="fas fa-check-circle me-2"></i>{{ success }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()

const register = () => {
  error.value = ''
  success.value = ''

  // Email格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }

  // 强密码校验（大写 + 小写 + 数字 + ≥8位）
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!passwordRegex.test(password.value)) {
    error.value = 'Password must be at least 8 characters long and contain uppercase, lowercase letters, and a number.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  // // ✅ 邮箱格式验证
  // if (!email.value.includes('@')) {
  //   error.value = 'Invalid email format.'
  //   return
  // }

  // // ✅ 密码长度验证
  // if (password.value.length < 6) {
  //   error.value = 'Password must be at least 6 characters.'
  //   return
  // }

  // ✅ 密码一致性验证
  // if (password.value !== confirmPassword.value) {
  //   error.value = 'Passwords do not match.'
  //   return
  // }

  const users = JSON.parse(localStorage.getItem('users')) || []
  if (users.find(u => u.email === email.value)) {
    error.value = 'Email already registered.'
    return
  }

  const newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
    role: email.value.trim() === 'admin@age.com' ? 'admin' : 'user',
    ratedEvents: [],
    favorites: []
  }

  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  success.value = '🎉 Registration successful. Redirecting...'

  setTimeout(() => {
    router.push('/login')
  }, 1500)
}
</script>

<style scoped>
.card {
  background: #ffffffd4;
  border-radius: 12px;
}
</style>
