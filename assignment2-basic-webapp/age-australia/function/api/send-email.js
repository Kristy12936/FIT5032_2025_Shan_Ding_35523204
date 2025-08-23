// POST /api/send-email
export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // 兼容 JSON 和 form-data
    const ct = request.headers.get("content-type") || "";
    let to, subject, message;

    if (ct.includes("application/json")) {
      ({ to, subject, message } = await request.json());
    } else {
      const form = await request.formData();
      to = form.get("to");
      subject = form.get("subject");
      message = form.get("message");
    }

    if (!to || !subject || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing fields" }),
        { status: 400 }
      );
    }

    // 调用 Resend API
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL, // 例如 "AgeAustralia <no-reply@your-domain.com>"
        to: [to],
        subject,
        text: message,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return new Response(
        JSON.stringify({ success: false, error: "Resend failed", detail }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: e.message }),
      { status: 500 }
    );
  }
}