// src/views/Dashboard.vue
<template>
  <div class="dashboard container">
    <h1 class="mb-4">User Dashboard</h1>
    <div class="mb-4">
      <p><strong>Total Events:</strong> {{ stats.totalEvents }}</p>
      <p><strong>Joined Events:</strong> {{ stats.joinedEvents }}</p>
      <p><strong>Average Rating:</strong> {{ stats.avgRating }}</p>
    </div>
    <div class="row">
      <div class="col-md-6">
        <canvas id="monthlyChart" style="height: 300px;"></canvas>
      </div>
      <div class="col-md-6">
        <canvas id="ratingChart" style="height: 300px;"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const user = computed(() => JSON.parse(localStorage.getItem('user')))
const events = ref([])
const userEvents = ref([])

const stats = computed(() => {
  const totalEvents = events.value.length
  const joinedEvents = userEvents.value.length
  const avgRating = userEvents.value.reduce((sum, event) => {
    const userRating = user.value?.ratedEvents?.find(r => r.eventId === event.id)?.rating
    return sum + (userRating || 0)
  }, 0) / (joinedEvents || 1)
  return {
    totalEvents,
    joinedEvents,
    avgRating: avgRating.toFixed(1)
  }
})

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const prepareMonthlyChartData = () => {
  const months = Array(12).fill(0)
  userEvents.value.forEach(event => {
    const month = new Date(event.date).getMonth()
    months[month]++
  })
  return months
}

const prepareRatingChartData = () => {
  const ratings = [0, 0, 0, 0, 0]
  userEvents.value.forEach(event => {
    const userRating = user.value?.ratedEvents?.find(r => r.eventId === event.id)?.rating
    if (userRating) ratings[Math.floor(userRating) - 1]++
  })
  return ratings
}

const renderCharts = (monthlyData, ratingData) => {
  new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels: monthNames,
      datasets: [{
        label: 'Events Joined',
        data: monthlyData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: chartOptions
  })
  new Chart(document.getElementById('ratingChart'), {
    type: 'pie',
    data: {
      labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      datasets: [{
        data: ratingData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: chartOptions
  })
}

const loadEvents = () => {
  const storedEvents = JSON.parse(localStorage.getItem('events')) || []
  events.value = storedEvents
  if (user.value) {
    userEvents.value = storedEvents.filter(event =>
      event.participants?.includes(user.value.email))

    const monthlyData = prepareMonthlyChartData()
    const ratingData = prepareRatingChartData()
    renderCharts(monthlyData, ratingData)
  }
}

onMounted(loadEvents)
</script>
