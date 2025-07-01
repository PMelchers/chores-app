// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCBZ8Lx5tN3Rxcvs5Pr0PkKDk6iriFQ3UM",
  authDomain: "taskio-1be41.firebaseapp.com",
  projectId: "taskio-1be41",
  storageBucket: "taskio-1be41.firebasestorage.app",
  messagingSenderId: "247655524446",
  appId: "1:247655524446:web:5ce1c0154db85385d4accf",
  measurementId: "G-HH7FETHNHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
