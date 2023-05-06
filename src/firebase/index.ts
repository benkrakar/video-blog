import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import 'firebase/firestore'
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import firebaseConfig from "./config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth: Auth = getAuth();

 export { auth, db };
