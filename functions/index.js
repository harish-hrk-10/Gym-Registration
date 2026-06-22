const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));

// Set region close to your users (Mumbai = asia-south1)
setGlobalOptions({ region: "asia-south1" });

// ── Resend config (safe — only runs on the server, never sent to browser) ──
const RESEND_API_KEY = "re_KaeHKB5U_AWSFaLCuLwmjppAHe2KXDiTg";
const NOTIFY_EMAIL   = "harishrathnakumar10@gmail.com";
const FROM_ADDRESS   = "onboarding@resend.dev";

// ── Helper: set CORS headers on every response ─────────────────────────────
function setCorsHeaders(res) {
  res.set("Access-Control-Allow-Origin",  "*");           // allow any origin
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

// ── HTTPS Cloud Function: sendEmail ────────────────────────────────────────
// OPTIONS /sendEmail  → preflight (browser sends this first)
// POST    /sendEmail  → { subject: string, html: string }
// ──────────────────────────────────────────────────────────────────────────
exports.sendEmail = onRequest(async (req, res) => {

  // 1. Set CORS headers on ALL responses (including errors)
  setCorsHeaders(res);

  // 2. Handle the browser's OPTIONS preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");   // 204 No Content — preflight approved
    return;
  }

  // 3. Only allow POST for actual requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { subject, html } = req.body;

  if (!subject || !html) {
    res.status(400).json({ error: "Missing subject or html in request body" });
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
      console.error("Resend API error:", data);
      res.status(500).json({ error: data.message ?? "Resend API failed" });
      return;
    }

    res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error("sendEmail function error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
