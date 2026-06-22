import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

document.getElementById("registrationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const plan = document.getElementById("plan").value;

    try {
      await addDoc(collection(db, "members"), {
        name,
        email,
        phone,
        plan,
        createdAt: new Date()
      });

      alert("Registration Successful!");

      window.location.href = "success.html";

    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
});