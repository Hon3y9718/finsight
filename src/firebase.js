import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBV0UmnVQBn7fIS2_7IDPNFY74JadBHD78",
  authDomain: "finsight-d0b2f.firebaseapp.com",
  projectId: "finsight-d0b2f",
  storageBucket: "finsight-d0b2f.firebasestorage.app",
  messagingSenderId: "927284775732",
  appId: "1:927284775732:web:be1a7a668b146c68d5b361",
  measurementId: "G-XDKRNTJQTS"
};

const app = initializeApp(firebaseConfig);

// ✅ Export Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);