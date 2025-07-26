<template>
  <div class="container mt-5">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="name" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <input v-model="confirmPassword" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

const register = () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }

  const users = JSON.parse(localStorage.getItem('users')) || []
  if (users.find(u => u.email === email.value)) {
    alert('Email already registered')
    return
  }

//   const newUser = {
//     name: name.value,
//     email: email.value,
//     password: password.value,
//     role: 'user',
//     ratedEvents: []
//   }
    const newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
    role: email.value.trim() === 'admin@age.com' ? 'admin' : 'user',
    ratedEvents: []
  }


  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  alert('Registration successful. Please login.')
  router.push('/login')
}
</script>
