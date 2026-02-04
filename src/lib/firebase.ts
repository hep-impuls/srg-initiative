import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDezsjWtq8p2TTQRG1YdZPegUcfSZNBwGI",
    authDomain: "interactive-media-2a1fc.firebaseapp.com",
    projectId: "interactive-media-2a1fc",
    storageBucket: "interactive-media-2a1fc.firebasestorage.app",
    messagingSenderId: "1094245132504",
    appId: "1:1094245132504:web:a47a79a7ec62d4c6e70fad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Silent anonymous sign-in
export const ensureAuth = async () => {
    if (auth.currentUser) return auth.currentUser;
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
};
