// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "upvhsu.firebaseapp.com",
  projectId: "upvhsu",
  storageBucket: "upvhsu.appspot.com",
  messagingSenderId: "1023736245170",
  appId: "1:1023736245170:web:a48a784287766d349cd2ab",
  measurementId: "G-0G1NRE20GV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);