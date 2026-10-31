import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
  apiKey: "AIzaSyDP0I0skdUjp0mqeHFZKlkgxyf1VldepYQ",
  authDomain: "agtskillsevent.firebaseapp.com",
  databaseURL: "https://agtskillsevent-default-rtdb.firebaseio.com",
  projectId: "agtskillsevent",
  storageBucket: "agtskillsevent.firebasestorage.app",
  messagingSenderId: "969548266264",
  appId: "1:969548266264:web:9f10830027021072b8fc6d",
};

// Safe initialization (Prevents "Firebase App already exists" error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export services
export const auth = getAuth(app);
export const db = getDatabase(app);
