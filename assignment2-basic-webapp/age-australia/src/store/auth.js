// src/store/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const setUser = (u) => {
    if (u) {
      const cleanUser = {
        email: u.email,
        uid: u.uid
      }
      user.value = cleanUser
      localStorage.setItem('user', JSON.stringify(cleanUser))
    } else {
      user.value = null
      localStorage.removeItem('user')
    }
  }

  const register = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    setUser(res.user)
  }

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password)
    setUser(res.user)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  onAuthStateChanged(auth, (u) => {
    if (u) {
      setUser(u)
    } else {
      setUser(null)
    }
  })

  return { user, login, register, logout }
})
