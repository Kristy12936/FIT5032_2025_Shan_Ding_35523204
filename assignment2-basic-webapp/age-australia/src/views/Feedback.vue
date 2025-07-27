<!-- src/views/Feedback.vue -->
<template>
  <div class="container mt-5" data-aos="fade-up">
    <h2>Submit Your Feedback</h2>
    <form @submit.prevent="submitFeedback">
      <div class="mb-3">
        <label for="message" class="form-label">Your Message</label>
        <Textarea id="message" v-model="message" autoResize rows="4" class="w-100" />
      </div>
      <Button type="submit" label="Submit" icon="pi pi-send" class="p-button-success" />
    </form>
    <div v-if="submitted" class="alert alert-success mt-3">Thank you for your feedback!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const message = ref('')
const submitted = ref(false)

const submitFeedback = () => {
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || []
  feedbacks.push({ message: message.value, time: new Date().toISOString() })
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks))
  message.value = ''
  submitted.value = true
}
</script>
