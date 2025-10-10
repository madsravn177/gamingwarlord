// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvX_qk1PMKr1pz8m1dp8CQL-cXSXCu4Qg",
  authDomain: "gamingwarlords-38f1f.firebaseapp.com",
  databaseURL: "https://gamingwarlords-38f1f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gamingwarlords-38f1f",
  storageBucket: "gamingwarlords-38f1f.firebasestorage.app",
  messagingSenderId: "295966434753",
  appId: "1:295966434753:web:03d96780118956832dfb40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { app, db }; // Eksporter både app og Firestoreimport { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

async function addUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "John Doe",
      score: 100
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}