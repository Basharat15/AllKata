// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUwc-Dz-S9iqyDZxVcLAA_3OLr5aWuGxQ",
  authDomain: "allkata.firebaseapp.com",
  projectId: "allkata",
  storageBucket: "allkata.appspot.com",
  messagingSenderId: "552750386267",
  appId: "1:552750386267:web:9a7391f8c54f13c824837e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
