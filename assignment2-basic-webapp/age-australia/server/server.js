import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 附件 ≤ 10MB
const PORT = process.env.PORT || 3000;

// 创建 SMTP transporter（Gmail 应用专用密码）
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SHOW_SMTP_PORT || process.env.SMTP_PORT || 465),
//   secure: String(process.env.SMTP_SECURE).toLowerCase() === "true", // 465 → true, 587 → false
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: (process.env.SMTP_PASS || "").trim(),
//   },
// });
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true", // 587 -> false
  auth: { user: process.env.SMTP_USER, pass: (process.env.SMTP_PASS || "").trim() },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000
});

// 启动时自检
transporter.verify((err, ok) => {
  if (err) console.error("❌ SMTP verify failed:", err.message);
  else console.log("✅ SMTP verify ok:", ok);
});

app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 健康检查(可选)
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// app.post("/send-email", upload.single("file"), async (req, res) => {
//   try {
//     const { to, subject, message } = req.body;
//     if (!to || !subject || !message) {
//       return res.status(400).json({ success: false, error: "Missing fields" });
//     }

//     const attachments = req.file
//       ? [{
//           filename: req.file.originalname,
//           content: req.file.buffer,
//           contentType: req.file.mimetype,
//         }]
//       : [];

//     await transporter.sendMail({
//       from: process.env.FROM_EMAIL, // 必须与 SMTP_USER 一致
//       to,
//       subject,
//       text: message,
//       attachments,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("SMTP error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
app.post("/send-email", upload.single("file"), async (req, res) => {
  // ✅ 干跑模式：带 ?dryRun=1 直接返回，不发 SMTP
  if (req.query.dryRun === "1") {
    return res.json({
      success: true,
      dryRun: true,
      received: {
        to: req.body?.to,
        subject: req.body?.subject,
        message: req.body?.message,
        hasFile: !!req.file
      }
    });
  }

  try {
    const { to, subject, message } = req.body;
    console.log("POST /send-email fields:", { to, subject, hasFile: !!req.file });

    if (!to || !subject || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const attachments = req.file ? [{
      filename: req.file.originalname,
      content: req.file.buffer,
      contentType: req.file.mimetype,
    }] : [];

    console.log("→ sending mail...");
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text: message,
      attachments,
    });
    console.log("✓ mail sent");
    res.json({ success: true });
  } catch (err) {
    console.error("SMTP error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



app.listen(PORT, () =>
  console.log(`✅ SMTP Mail API running at http://localhost:${PORT}`)
);