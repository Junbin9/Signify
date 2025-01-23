import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8xs-KpdWg66sY4YtHbJ7BQJF_Fjg3-7s",
  authDomain: "signify-29c6f.firebaseapp.com",
  projectId: "signify-29c6f",
  storageBucket: "signify-29c6f.appspot.com",
  messagingSenderId: "54223680461",
  appId: "1:54223680461:web:f2bf107ec3a74d26a60a84",
  measurementId: "G-0JSCE3CZ7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
