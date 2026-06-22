import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { sendEmailViaResend } from "./resend.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZDnPONIQhXgrpypBNI4DVdkAoG07Cg7U",
  authDomain: "gym-register-d6987.firebaseapp.com",
  projectId: "gym-register-d6987",
  storageBucket: "gym-register-d6987.firebasestorage.app",
  messagingSenderId: "803355830301",
  appId: "1:803355830301:web:bba78d2faea0450aad7ef4",
  measurementId: "G-4QB18NFX2F"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Contact form on index.html ─────────────────────────────────────────────
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name    = document.getElementById("contactName").value.trim();
    const email   = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        createdAt: new Date()
      });

      // 2. Send email notification via Resend
      await sendEmailViaResend(
        `📬 New Contact Message from ${name}`,
        `
        <h2 style="color:#f44336;">New Contact Form Submission</h2>
        <table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;">Name</td>   <td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td>  <td style="padding:8px;">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${message}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:20px;">Sent from IronFlex Gym website.</p>
        `
      );

      alert("Message sent successfully!");
      contactForm.reset();

    } catch (error) {
      console.error("Contact form error:", error);
      alert("Error sending message. Please try again.");
    }
  });
}
