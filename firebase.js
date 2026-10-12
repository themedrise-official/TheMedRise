// MedRise Firebase setup.
// Note: a Firebase web config is NOT a secret. Real protection comes from
// Firebase Authentication settings, Firestore rules and API-key restrictions.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhgPy7737Ax8XkN9L6yUoAbMlWdoC_xug",
  authDomain: "themedrise.web.app",
  projectId: "medrise-82c20",
  storageBucket: "medrise-82c20.firebasestorage.app",
  messagingSenderId: "315166631216",
  appId: "1:315166631216:web:493d4993b761996cd094f5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;

// Firestore is not used by any page yet, so it is NOT loaded here (it is a big
// download and every protected page waits for this file before it appears).
// When you really need it, add:
//   import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
//   export const db = getFirestore(app);
