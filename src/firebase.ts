// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0Z8L91upDmhURTaCox5lOlmWdVvPejL8",
  authDomain: "client-manager-app-e0058.firebaseapp.com",
  databaseURL: "https://client-manager-app-e0058-default-rtdb.firebaseio.com",
  projectId: "client-manager-app-e0058",
  storageBucket: "client-manager-app-e0058.firebasestorage.app",
  messagingSenderId: "452976841094",
  appId: "1:452976841094:web:2426d63fde3298f8dd9c07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
