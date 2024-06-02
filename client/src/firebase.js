// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "seig-mern-estate.firebaseapp.com",
  projectId: "seig-mern-estate",
  storageBucket: "seig-mern-estate.appspot.com",
  messagingSenderId: "592799080830",
  appId: "1:592799080830:web:7cd8b31baa3dba6be4132f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);