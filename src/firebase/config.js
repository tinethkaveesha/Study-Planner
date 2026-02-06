import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDemoKeyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "study-planner-demo.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://study-planner-demo.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "study-planner-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "study-planner-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

let app, database, auth, db;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Enable session persistence - user stays signed in until browser closes
  setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.warn("Persistence setup failed:", error);
  });
} catch (error) {
  console.warn("Firebase initialization failed:", error);
  // Provide dummy exports so app doesn't crash
  database = null;
  auth = null;
  db = null;
}

export { database, auth, db };
export default app;
