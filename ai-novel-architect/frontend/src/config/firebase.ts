// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhuY6oi8MCkiyqq34cHXoTRloUdzSYdro",
  authDomain: "monlivreia.firebaseapp.com",
  projectId: "monlivreia",
  storageBucket: "monlivreia.firebasestorage.app",
  messagingSenderId: "1076372219466",
  appId: "1:1076372219466:web:fcf586cebbcfe1505f28b3",
  measurementId: "G-3WK84EVTCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
