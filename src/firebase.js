import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkom84Eeu0bB0StOmw6LS3VDHIdMgK8ok",
  authDomain: "study-planner-4ca17.firebaseapp.com",
  projectId: "study-planner-4ca17",
  storageBucket: "study-planner-4ca17.firebasestorage.app",
  messagingSenderId: "226429771240",
  appId: "1:226429771240:web:734f80053681e675b4d85d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);