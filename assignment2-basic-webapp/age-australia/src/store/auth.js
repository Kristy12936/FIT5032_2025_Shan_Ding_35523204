import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const setUser = (u) => {
    user.value = u
    localStorage.setItem('user', JSON.stringify(u))
  }
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }
  return { user, setUser, logout }
})
