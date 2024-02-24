import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
