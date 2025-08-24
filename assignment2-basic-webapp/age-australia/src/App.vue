<template>
  <div class="app-wrapper">
    <!-- Confirm Logout Dialog -->
    <ConfirmDialog />

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3" data-aos="fade-down">
      <div class="container-fluid">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.png" alt="Logo" width="32" height="32" class="me-2" />
          <span>EmpowerAge</span>
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact-active-class="active">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/articles" exact-active-class="active">Articles</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/events" exact-active-class="active">Events</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/resources" exact-active-class="active">Resources</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard" exact-active-class="active">Dashboard</router-link>
            </li>

            <!-- Admin Panel -->
            <li class="nav-item" v-if="isAdmin">
              <router-link class="nav-link" to="/admin" exact-active-class="active">Admin</router-link>
            </li>

            <!-- 未登录 -->
            <li class="nav-item" v-if="!currentUser">
              <router-link class="nav-link" to="/login" exact-active-class="active">Login</router-link>
            </li>
            <li class="nav-item" v-if="!currentUser">
              <router-link class="nav-link" to="/register" exact-active-class="active">Register</router-link>
            </li>

            <!-- 登录后用户下拉菜单 -->
            <li class="nav-item dropdown" v-if="currentUser">
              <a
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ currentUser.email }}
                <span class="badge ms-2" :class="isAdmin ? 'bg-danger' : 'bg-secondary'">
                  {{ isAdmin ? 'admin' : 'user' }}
                </span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <router-link class="dropdown-item" to="/dashboard">
                    <i class="fas fa-user me-2"></i>Dashboard
                  </router-link>
                </li>
                <li>
                  <button class="dropdown-item text-danger" @click.prevent="confirmLogout">
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 页面主体内容 -->
    <main class="main-content container py-4" data-aos="fade-up">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const confirm = useConfirm()
const authStore = useAuthStore()

// 当前用户信息
const currentUser = computed(() => authStore.user)

// 是否为管理员
const isAdmin = computed(() => currentUser.value?.email === 'admin@age.com')

// 登出逻辑
const logout = async () => {
  await authStore.logout()
  router.push('/')
}

// 确认登出框
const confirmLogout = () => {
  confirm.require({
    message: 'Are you sure you want to logout?',
    header: 'Logout Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => logout()
  })
}
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f9ff, #d2e8ff, #e6f7f7);
  background-image: url('/bg-pattern.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  font-family: 'Segoe UI', sans-serif;
  padding-bottom: 30px;
  color: #333;
  overflow-x: hidden;
}

.main-content.container {
  background: #ffffffea;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(182, 142, 142, 0.1);
  backdrop-filter: blur(3px);
  position: relative;
  overflow: visible !important;
  z-index: 100;
}

.navbar-brand span {
  font-weight: 600;
  font-size: 1.3rem;
  color: #0077cc;
}

.router-link-exact-active {
  font-weight: bold;
  color: #0d6efd !important;
}

/* 美化滚动条 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #b4c7dd;
  border-radius: 4px;
}
</style>
