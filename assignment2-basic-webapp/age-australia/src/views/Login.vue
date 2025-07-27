<template>
  <div class="container d-flex justify-content-center align-items-center mt-5" data-aos="fade-up">
    <div class="card shadow-lg p-4 border-0" style="min-width: 400px;">
      <h3 class="text-center mb-4 text-primary">
        <i class="fas fa-sign-in-alt me-2"></i>Login to EmpowerAge
      </h3>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">
            <i class="fas fa-envelope me-2 text-secondary"></i>Email
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="form-control"
            placeholder="you@example.com"
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">
            <i class="fas fa-lock me-2 text-secondary"></i>Password
          </label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-control"
            placeholder="Enter password"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          <i class="fas fa-sign-in-alt me-2"></i>Login
        </button>
      </form>

      <div v-if="error" class="alert alert-danger mt-3">
        <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = () => {
  error.value = ''

  // ✅ Email 格式校验
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }

  // ✅ 密码复杂度校验：至少 8 位，含大小写字母和数字
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!passwordRegex.test(password.value)) {
    error.value = 'Password must be at least 8 characters long and contain uppercase, lowercase letters, and a number.'
    return
  }

  // ✅ 登录验证
  const storedUsers = JSON.parse(localStorage.getItem('users')) || []
  const user = storedUsers.find(u => u.email === email.value)

  if (!user) {
    error.value = 'Email not found. Please register first.'
    return
  }

  if (user.password !== password.value) {
    error.value = 'Incorrect password. Please try again.'
    return
  }

  localStorage.setItem('user', JSON.stringify(user))
  router.push('/')
}
</script>

<style scoped>
.card {
  border-radius: 16px;
  background: linear-gradient(145deg, #fdf8f4, #f1f6ff); /* 🌈 淡暖渐变 */
  border: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

</style>
