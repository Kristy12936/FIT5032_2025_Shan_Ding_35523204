// import axios from "axios";

// export async function sendEmailAPI({ to, subject, message, file }) {
//   const formData = new FormData();
//   formData.append("to", to);
//   formData.append("subject", subject);
//   formData.append("message", message);
//   if (file) formData.append("file", file);

//   try {
//     const { data } = await axios.post("http://localhost:3000/send-email", formData);
//     if (!data?.success) throw new Error(data?.error || "Unknown error");
//     return data;
//   } catch (err) {
//     console.error("sendEmailAPI error:", err?.response?.data || err.message);
//     throw err;
//   }
// }

// src/utils/emailService.js
// 线上（Pages 访问）强制同域调用 /api；本地开发才走 wrangler 地址
const isProd = import.meta.env.PROD;
const DEV_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8788';
const BASE = isProd ? location.origin : DEV_BASE;

function jsonHeaders() {
  return { 'Content-Type': 'application/json' };
}

export async function sendEmailAPI({ to, subject, message }) {
  if (!to || !subject || !message) {
    return { success: false, error: 'Missing fields' };
  }
  try {
    const r = await fetch(new URL('/api/send-email', BASE), {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ to, subject, message }),
    });
    const data = await r.json().catch(() => ({}));
    return r.ok ? { success: true } : { success: false, error: data.error, detail: data.detail };
  } catch (e) {
    return { success: false, error: 'Network Error', detail: e?.message || e };
  }
}
