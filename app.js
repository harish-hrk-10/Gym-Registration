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

// ── Registration form on register.html ────────────────────────────────────
document.getElementById("registrationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name  = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const plan  = document.getElementById("plan").value;

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "members"), {
        name,
        email,
        phone,
        plan,
        createdAt: new Date()
      });

      // 2. Send email notification via Resend
      await sendEmailViaResend(
        `🏋️ New Gym Member Registered: ${name}`,
        `
        <h2 style="color:#f44336;">New Member Registration</h2>
        <table style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;">Name</td>  <td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td> <td style="padding:8px;">${email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone</td> <td style="padding:8px;">${phone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Plan</td>  <td style="padding:8px;">${plan}</td></tr>
        </table>
        <p style="color:#888;font-size:12px;margin-top:20px;">Sent from IronFlex Gym registration page.</p>
        `
      );

      alert("Registration Successful!");
      window.location.href = "success.html";

    } catch (error) {
      console.error("Registration error:", error);
      alert("Error saving data. Please try again.");
    }
  });