import { initializeApp } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvWhcubeg8106zirFnI30ACuD5LUaEWQM",
  authDomain: "pulsepost-cc4fe.firebaseapp.com",
  projectId: "pulsepost-cc4fe",
  storageBucket: "pulsepost-cc4fe.appspot.com",
  messagingSenderId: "833990023445",
  appId: "1:833990023445:web:63a583149bc9cc65a1f11c",
};

// Initialize Firebase

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
