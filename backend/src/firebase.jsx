const VITE_FIREBASE_APP_API_KEY = import.meta.env.VITE_FIREBASE_APP_API_KEY;
const VITE_FIREBASE_APP_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_APP_AUTH_DOMAIN;
const VITE_FIREBASE_APP_PROJECT_ID = import.meta.env.VITE_FIREBASE_APP_PROJECT_ID;
const VITE_FIREBASE_APP_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_APP_STORAGE_BUCKET;
const VITE_FIREBASE_APP_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_APP_MESSAGING_SENDER_ID;
const VITE_FIREBASE_APP_APP_ID = import.meta.env.VITE_FIREBASE_APP_APP_ID;

import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO64iozzpqOTDkrfrR2RUJqepUx3MTcnk",
  authDomain: "tareeqalraha-f7976.firebaseapp.com",
  projectId: "tareeqalraha-f7976",
  storageBucket: "tareeqalraha-f7976.firebasestorage.app",
  messagingSenderId: "256314674074",
  appId: "1:256314674074:web:e59fd6b938b8e02c448823",
  measurementId: "G-ZM9356RRH1"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
