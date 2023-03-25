import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJJHmKRRhvFfmlt0AHZ8bU-h2LEsPjcs8",
  authDomain: "socialapp-3aa4e.firebaseapp.com",
  projectId: "socialapp-3aa4e",
  storageBucket: "socialapp-3aa4e.appspot.com",
  messagingSenderId: "968499729210",
  appId: "1:968499729210:web:0bad1c40851b7c6b3f3603",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
