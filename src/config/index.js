import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC49QFBvQR562OsyLer-9DdyHr8gBdnGwQ",
  authDomain: "chat-app-reactjs-c1f27.firebaseapp.com",
  projectId: "chat-app-reactjs-c1f27",
  storageBucket: "chat-app-reactjs-c1f27.appspot.com",
  messagingSenderId: "954287926483",
  appId: "1:954287926483:web:b2507791f6dedb6003b826",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  getDoc,
  db,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  addDoc,
  onSnapshot,
  serverTimestamp,
  orderBy
};
