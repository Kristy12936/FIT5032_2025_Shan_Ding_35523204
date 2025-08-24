import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(true)
  const error = ref(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const userId = computed(() => user.value?.uid)
  const userEmail = computed(() => user.value?.email)
  const displayName = computed(() => user.value?.displayName)

  // 设置用户信息
  const setUser = (u) => {
    if (u) {
      const cleanUser = {
        email: u.email,
        uid: u.uid,
        displayName: u.displayName,
        emailVerified: u.emailVerified,
        photoURL: u.photoURL
      }
      user.value = cleanUser
      localStorage.setItem('user', JSON.stringify(cleanUser))
    } else {
      user.value = null
      localStorage.removeItem('user')
    }
  }

  // 清除错误信息
  const clearError = () => {
    error.value = null
  }

  // 错误消息处理
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address format.',
      'auth/user-disabled': 'User account has been disabled.',
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'Email address is already in use.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
      'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'default': 'An unexpected error occurred. Please try again.'
    }
    
    return errorMessages[errorCode] || errorMessages['default']
  }

  // 注册用户
  const register = async (email, password, displayName = '') => {
    try {
      clearError()
      const res = await createUserWithEmailAndPassword(auth, email, password)
      
      // 更新用户显示名称（如果提供了）
      if (displayName) {
        await updateProfile(res.user, { displayName })
      }
      
      // 发送邮箱验证邮件（可选）
      await sendEmailVerification(res.user)
      
      setUser(res.user)
      return { success: true, user: res.user }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 用户登录
  const login = async (email, password) => {
    try {
      clearError()
      const res = await signInWithEmailAndPassword(auth, email, password)
      setUser(res.user)
      return { success: true, user: res.user }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 用户登出
  const logout = async () => {
    try {
      clearError()
      await signOut(auth)
      setUser(null)
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 发送密码重置邮件
  const resetPassword = async (email) => {
    try {
      clearError()
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 更新用户资料
  const updateUserProfile = async (updates) => {
    try {
      clearError()
      await updateProfile(auth.currentUser, updates)
      
      // 更新本地状态
      if (updates.displayName) {
        user.value.displayName = updates.displayName
        localStorage.setItem('user', JSON.stringify(user.value))
      }
      
      return { success: true }
    } catch (err) {
      error.value = getErrorMessage(err.code)
      return { success: false, error: error.value }
    }
  }

  // 初始化认证状态监听
  const initAuth = () => {
    loading.value = true
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u)
      } else {
        setUser(null)
      }
      loading.value = false
    }, (err) => {
      console.error('Auth state change error:', err)
      error.value = getErrorMessage(err.code)
      loading.value = false
    })
    
    return unsubscribe
  }

  // 立即初始化认证状态
  const unsubscribe = initAuth()

  // 清理函数（可选）
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }

  return {
    // 状态
    user,
    loading,
    error,
    
    // 计算属性
    isAuthenticated,
    userId,
    userEmail,
    displayName,
    
    // 方法
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    clearError,
    cleanup
  }
})