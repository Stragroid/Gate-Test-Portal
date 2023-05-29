// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUJfxD5_-pMYxp6CejqCqBXbu6585-pyU",
  authDomain: "rlc-gate-test-portal.firebaseapp.com",
  projectId: "rlc-gate-test-portal",
  storageBucket: "rlc-gate-test-portal.appspot.com",
  messagingSenderId: "150526929873",
  appId: "1:150526929873:web:29986cc1c9d3bc6ba4cef0",
  measurementId: "G-K7PHLHJ81Q"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const initFirebase = () => {
  return app;
};

export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
export default app;
export const auth = getAuth(app);