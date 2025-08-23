// Cloudflare Pages Function: POST /api/send-email
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1) 解析输入
    const ct = request.headers.get("content-type") || "";
    let to, subject, message, debug;
    if (ct.includes("application/json")) {
      ({ to, subject, message, debug } = await request.json());
    } else {
      const form = await request.formData();
      to = form.get("to");
      subject = form.get("subject");
      message = form.get("message");
      debug = form.get("debug");
    }

    // 2) 基本校验
    if (!to || !subject || !message) {
      return json({ success: false, error: "Missing fields (to, subject, message)" }, 400);
    }
    if (!env.RESEND_API_KEY) {
      return json({ success: false, error: "Server misconfigured: RESEND_API_KEY missing" }, 500);
    }
    if (!env.FROM_EMAIL) {
      return json({ success: false, error: "Server misconfigured: FROM_EMAIL missing" }, 500);
    }

    // 3) 调 Resend
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,     // e.g. "AgeAustralia <onboarding@resend.dev>"
        to: [to],
        subject,
        text: message,
      }),
    });

    const text = await r.text();
    if (!r.ok) {
      // 尝试解析错误并给出建议
      let hint = "Resend failed.";
      if (r.status === 401 || r.status === 403) {
        hint = "Invalid API key or unauthorized. Check RESEND_API_KEY.";
      } else if (r.status === 422) {
        if (/from/i.test(text) && /verify/i.test(text)) {
          hint = "FROM_EMAIL domain/address not verified. Use onboarding@resend.dev or verify your domain/email in Resend.";
        } else {
          hint = "Validation error. Check 'to', 'from', 'subject', 'text'.";
        }
      } else if (r.status === 429) {
        hint = "Rate limited. Try again later.";
      }
      // 打日志方便在 Cloudflare 控制台查看
      console.error("Resend error:", r.status, text);
      return json({ success: false, error: hint, detail: text, status: r.status }, 500);
    }

    // 成功
    return json({ success: true, detail: text }, 200);

  } catch (e) {
    console.error("Function error:", e);
    return json({ success: false, error: e.message || String(e) }, 500);
  }
}


// 小工具：返回 JSON 响应
function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
