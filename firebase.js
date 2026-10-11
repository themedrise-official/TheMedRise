import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YAHAN_APNI_API_KEY_DAAL_STE",
  authDomain: "YAHAN_AUTH_DOMAIN_DAALO",
  projectId: "medrise-82c20",
  storageBucket: "YAHAN_STORAGE_BUCKET_DAALO",
  messagingSenderId: "YAHAN_MESSAGING_SENDER_ID_DAALO",
  appId: "YAHAN_APP_ID_DAALO"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
