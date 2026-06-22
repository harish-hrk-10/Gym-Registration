// ── Resend email helper (frontend) ────────────────────────────────────────
// Calls our own secure backend (/api/sendEmail) — API key never in the browser.
//
// • On Vercel (production) : uses relative URL  → same origin, zero CORS
// • On localhost           : uses relative URL  → works via `vercel dev`
// ──────────────────────────────────────────────────────────────────────────

const SEND_EMAIL_URL = "/api/sendEmail";

/**
 * sendEmailViaResend
 * @param {string} subject  - Email subject line
 * @param {string} htmlBody - HTML body of the email
 */
export async function sendEmailViaResend(subject, htmlBody) {
  const response = await fetch(SEND_EMAIL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, html: htmlBody })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Email error: ${response.status} – ${err.error ?? "unknown"}`);
  }
}
