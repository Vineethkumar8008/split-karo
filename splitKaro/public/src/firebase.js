import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGrpovYnx57obR-IFxV-ugwZiop6jFF64",
  authDomain: "spliteasy-79bb5.firebaseapp.com",
  projectId: "spliteasy-79bb5",
  storageBucket: "spliteasy-79bb5.firebasestorage.app",
  messagingSenderId: "609720132658",
  appId: "1:609720132658:web:c0b963969346330292082b",
};

const app = initializeApp(firebaseConfig);

// 🔥 Firebase Authentication
export const auth = getAuth(app);

// 🔥 Firestore DB
export const db = getFirestore(app);