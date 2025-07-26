<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">AgeAustralia</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/events">Events</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/dashboard">Dashboard</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/admin">Admin</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/login">Login</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/register">Register</router-link></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>