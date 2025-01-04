// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTZRThJgkZHplXbHXK0K8jKBZzycJpSls",
  authDomain: "upvhsu.firebaseapp.com",
  projectId: "upvhsu",
  storageBucket: "upvhsu.appspot.com",
  messagingSenderId: "1023736245170",
  appId: "1:1023736245170:web:a48a784287766d349cd2ab",
  measurementId: "G-0G1NRE20GV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export `app` for use in other modules
export { app };
