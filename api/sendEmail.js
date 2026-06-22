// api/sendEmail.js  — Vercel Serverless Function
// The Resend API key lives here on the server. Never sent to the browser.

const RESEND_API_KEY = "re_KaeHKB5U_AWSFaLCuLwmjppAHe2KXDiTg";
const NOTIFY_EMAIL   = "harishrathnakumar10@gmail.com";
const FROM_ADDRESS   = "onboarding@resend.dev";

export default async function handler(req, res) {
  // ── CORS headers (needed if calling from a different origin e.g. localhost) ──
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { subject, html } = req.body;

  if (!subject || !html) {
    res.status(400).json({ error: "Missing subject or html" });
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type":  "application/json"
      },
      body: JSON.stringify({
        from:    FROM_ADDRESS,
        to:      [NOTIFY_EMAIL],
        subject: subject,
        html:    html
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);
      res.status(500).json({ error: data.message ?? "Resend API failed" });
      return;
    }

    res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
