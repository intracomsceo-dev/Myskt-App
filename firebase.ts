import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4ru-Vz-Pil1loBuQqSnpLs4pkKvjAchY",
  authDomain: "sktmobile-app.firebaseapp.com",
  projectId: "sktmobile-app",
  storageBucket: "sktmobile-app.firebasestorage.app",
  messagingSenderId: "838975213936",
  appId: "1:838975213936:web:c159fcfd8550bf58247fb5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
