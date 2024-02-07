import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDwJC6-EJda4wWYngksM5ZVV1hmCsCx5sA",
    authDomain: "vueexam-15ff4.firebaseapp.com",
    projectId: "vueexam-15ff4",
    storageBucket: "vueexam-15ff4.appspot.com",
    messagingSenderId: "761721594237",
    appId: "1:761721594237:web:eda28fdedaf5ed63526c14"
  };

// Initialize Firebase
function firebaseInit(){

initializeApp(firebaseConfig)
}

export default firebaseInit



