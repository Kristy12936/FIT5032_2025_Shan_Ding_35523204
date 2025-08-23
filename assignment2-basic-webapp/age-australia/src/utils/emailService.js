import axios from "axios";

export async function sendEmailAPI({ to, subject, message, file }) {
  const formData = new FormData();
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("message", message);
  if (file) formData.append("file", file);

  try {
    const { data } = await axios.post("http://localhost:3000/send-email", formData);
    if (!data?.success) throw new Error(data?.error || "Unknown error");
    return data;
  } catch (err) {
    console.error("sendEmailAPI error:", err?.response?.data || err.message);
    throw err;
  }
}
