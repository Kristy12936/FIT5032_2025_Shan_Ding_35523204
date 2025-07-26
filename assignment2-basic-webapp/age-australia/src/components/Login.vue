// src/components/Login.vue
<template>
  <div class="container col-md-6 offset-md-3">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" required class="form-control">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" required class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
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
  const storedUsers = JSON.parse(localStorage.getItem('users')) || []
  const found = storedUsers.find(u => u.email === email.value && u.password === password.value)
  if (found) {
    localStorage.setItem('user', JSON.stringify(found))
    router.push('/')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>


// src/components/Register.vue
<template>
  <div class="container col-md-6 offset-md-3">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="email" required class="form-control">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" v-model="password" required class="form-control">
      </div>
      <div class="mb-3">
        <label for="confirm" class="form-label">Confirm Password</label>
        <input type="password" id="confirm" v-model="confirm" required class="form-control">
      </div>
      <button type="submit" class="btn btn-success">Register</button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const router = useRouter()

const handleRegister = () => {
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match'
    return
  }
  const users = JSON.parse(localStorage.getItem('users')) || []
  if (users.find(u => u.email === email.value)) {
    error.value = 'User already exists'
    return
  }
  const newUser = { email: email.value, password: password.value, role: email.value === 'admin@age.com' ? 'admin' : 'user', ratedEvents: [] }
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('user', JSON.stringify(newUser))
  router.push('/')
}
</script>
