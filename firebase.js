
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhgPy7737Ax8XkN9L6yUoAbMLWdoC_xuj",
  authDomain: "medrise-82c20.firebaseapp.com",
  projectId: "medrise-82c20",
  storageBucket: "medrise-82c20.firebasestorage.app",
  messagingSenderId: "315166631216",
  appId: "1:315166631216:web:493d4993b761996cd094f5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
