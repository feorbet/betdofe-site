import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbcbwlLv2hzIH4SXgz20GcozWJH5lsZBI",
  authDomain: "bettingapp-d6a38.firebaseapp.com",
  projectId: "bettingapp-d6a38",
  storageBucket: "bettingapp-d6a38.firebasestorage.app",
  messagingSenderId: "828161650526",
  appId: "1:828161650526:web:3b02f4dca86ebdc927e9cf",
  measurementId: "G-10HEBBCFG5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);