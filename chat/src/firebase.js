
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAs882A7iH0sQwzyPbyKRmDdQcy0XOjDGU",
  authDomain: "pgchat-a08b6.firebaseapp.com",
  projectId: "pgchat-a08b6",
  storageBucket: "pgchat-a08b6.appspot.com",
  messagingSenderId: "320501472638",
  appId: "1:320501472638:web:ce69ebe9a53b992b12672f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();