import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PJ_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
