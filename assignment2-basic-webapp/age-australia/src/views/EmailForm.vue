<template>
  <div class="container py-4">
    <h2>Send Email</h2>

    <form @submit.prevent="onSubmit">
      <input v-model.trim="to" type="email" placeholder="Recipient Email" class="form-control mb-2" required />
      <input v-model.trim="subject" type="text" placeholder="Subject" class="form-control mb-2" required />
      <textarea v-model.trim="message" placeholder="Message" class="form-control mb-2" rows="5" required></textarea>

      <!-- 先保留文件选择控件，但当前函数不会处理附件 -->
      <input type="file" @change="handleFile" class="form-control mb-2" />

      <!-- 状态提示 -->
      <div v-if="sending" class="alert alert-info py-2">⏳ Sending...</div>
      <div v-else-if="status === 'ok'" class="alert alert-success py-2">✅ Sent successfully.</div>
      <pre v-else-if="status === 'err'" class="alert alert-danger py-2 mb-2" style="white-space:pre-wrap;">{{ statusText }}</pre>

      <button type="submit" class="btn btn-primary" :disabled="sending">
        {{ sending ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendEmailAPI } from '@/utils/emailService'  // 见下方emailService.js

const to = ref('')
const subject = ref('')
const message = ref('')
const file = ref(null) // 现在不上传，但先保留引用

function handleFile(e) {
  file.value = e.target.files?.[0] ?? null
}

const sending = ref(false)
const status = ref(null) // 'ok' | 'err' | null
const statusText = ref('')

async function onSubmit () {
  status.value = null
  statusText.value = ''
  sending.value = true
  try {
    const { success, error, detail } = await sendEmailAPI({
      to: to.value, subject: subject.value, message: message.value
      // 不传 file：当前云函数只接受 JSON 三个字段
    })
    if (success) {
      status.value = 'ok'
      // 可选：清空表单
      // to.value = subject.value = message.value = ''
    } else {
      status.value = 'err'
      statusText.value = `Failed: ${error || 'Unknown error'}${detail ? '\n' + detail : ''}`
    }
  } catch (err) {
    status.value = 'err'
    statusText.value = `Failed: ${err?.response?.data?.error || err.message}`
  } finally {
    sending.value = false
  }
}
</script>
