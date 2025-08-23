<template>
  <div class="container py-4">
    <h2>Send Email</h2>
    <form @submit.prevent="sendEmail">
      <input v-model="to" placeholder="Recipient Email" class="form-control mb-2" required />
      <input v-model="subject" placeholder="Subject" class="form-control mb-2" required />
      <textarea v-model="message" placeholder="Message" class="form-control mb-2" required></textarea>
      <input type="file" @change="handleFile" class="form-control mb-2" />
      <button type="submit" class="btn btn-primary">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendEmailAPI } from '@/utils/emailService'

const to = ref("")
const subject = ref("")
const message = ref("")
const file = ref(null)

function handleFile(e) {
  file.value = e.target.files[0]
}

async function sendEmail() {
  await sendEmailAPI({ to: to.value, subject: subject.value, message: message.value, file: file.value })
  alert("Email sent successfully!")
}
</script>
