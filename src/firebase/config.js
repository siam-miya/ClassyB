// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQnqklLkMPw5oTgpT1J9MGNfD7UNi0zu4",
  authDomain: "uniquebd.firebaseapp.com",
  projectId: "uniquebd",
  storageBucket: "uniquebd.firebasestorage.app",
  messagingSenderId: "418390343296",
  appId: "1:418390343296:web:c12716f6716ec779deb065"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ✅ এই লাইনটা add করুন
setPersistence(auth, browserLocalPersistence);

export default app;