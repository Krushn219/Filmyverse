import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_aPP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const movieCollection = collection(db, "movies");
export const reviewCollection = collection(db, "reviews");
export const userCollection = collection(db, "users");

export default app;
