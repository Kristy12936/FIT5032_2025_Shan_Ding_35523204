
// const isProd = import.meta.env.PROD;
// const DEV_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8788';
// const BASE = isProd ? location.origin : DEV_BASE;

// function jsonHeaders() {
//   return { 'Content-Type': 'application/json' };
// }

// export async function sendEmailAPI({ to, subject, message }) {
//   if (!to || !subject || !message) {
//     return { success: false, error: 'Missing fields' };
//   }
//   try {
//     const r = await fetch(new URL('/api/send-email', BASE), {
//       method: 'POST',
//       headers: jsonHeaders(),
//       body: JSON.stringify({ to, subject, message }),
//     });
//     const data = await r.json().catch(() => ({}));
//     return r.ok ? { success: true } : { success: false, error: data.error, detail: data.detail };
//   } catch (e) {
//     return { success: false, error: 'Network Error', detail: e?.message || e };
//   }
// }


// src/utils/emailService.js
import axios from "axios";

/**
 * 只用 Cloudflare Pages Functions:
 * - 线上（Visit Pages 域名访问）：同域调用 /api/send-email
 * - 本地调试（wrangler pages dev .）：同域是 http://127.0.0.1:8788，也能直接用 /api/send-email
 * - 如果你仍想在本地用 Vite:5173 开发，可在 .env.development 里设置
 *   VITE_API_BASE=http://127.0.0.1:8788 让请求代理到 wrangler
 */

const isProd = import.meta.env.PROD;

// 默认线上 / 同域。开发环境可用 VITE_API_BASE 覆盖到 127.0.0.1:8788
const BASE = isProd
  ? (typeof window !== "undefined" ? window.location.origin : "")
  : (import.meta.env.VITE_API_BASE || "http://127.0.0.1:8788");

// Cloudflare Pages Functions 路由固定是 /api/send-email
const API_PATH = "/api/send-email";

const http = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/**
 * 发送邮件（调用 Pages Function）
 * @param {{to:string, subject:string, message:string}} p
 * @returns {Promise<{success:boolean, error?:string, detail?:any}>}
 */
export async function sendEmailAPI({ to, subject, message }) {
  if (!to || !subject || !message) {
    return { success: false, error: "Missing fields" };
  }

  try {
    const { data } = await http.post(API_PATH, { to, subject, message });
    return data?.success
      ? { success: true }
      : { success: false, error: data?.error || "Unknown error", detail: data?.detail };
  } catch (err) {
    // 统一错误输出
    const resp = err?.response?.data;
    return {
      success: false,
      error: (resp && resp.error) || err.message || "Network Error",
      detail: resp && resp.detail,
    };
  }
}

/** 可选：健康探测（本地/线上都可用） */
export async function pingEmailAPI() {
  try {
    const r = await http.options(API_PATH);
    return r.status >= 200 && r.status < 400;
  } catch {
    return false;
  }
}
