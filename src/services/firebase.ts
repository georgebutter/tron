import * as firebase from 'firebase'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw7oemz_S59I5-zvvvrzjrOwcb9CI4mLc",
  authDomain: "tron-14d6e.firebaseapp.com",
  databaseURL: "https://tron-14d6e.firebaseio.com",
  projectId: "tron-14d6e",
  storageBucket: "tron-14d6e.appspot.com",
  messagingSenderId: "19641235171",
  appId: "1:19641235171:web:50842aa7f2e34a2368f7d6",
  measurementId: "G-TZX2F0GMD6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth;
export const sockets = firebase.database();
export const db = firebase.firestore();