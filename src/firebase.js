// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";           // ✅ Import getAuth
import { getFirestore } from "firebase/firestore"; // ✅ Import getFirestore
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV0UmnVQBn7fIS2_7IDPNFY74JadBHD78",
  authDomain: "finsight-d0b2f.firebaseapp.com",
  databaseURL: "https://finsight-d0b2f-default-rtdb.firebaseio.com",
  projectId: "finsight-d0b2f",
  storageBucket: "finsight-d0b2f.firebasestorage.app",
  messagingSenderId: "927284775732",
  appId: "1:927284775732:web:be1a7a668b146c68d5b361",
  measurementId: "G-XDKRNTJQTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth & Firestore once only
export const auth = getAuth(app);
export const db = getFirestore(app);