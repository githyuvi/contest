import { initializeApp } from "firebase/app";

const firebaseConfig = {
    
    apiKey: "AIzaSyBS5C8p33p3bQHVE3r2IlM_XY5hJukuBZs",
    authDomain: "poll.cmientranceexam.in",
    databaseURL: "https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-algomuse",
    storageBucket: "fir-algomuse.appspot.com",
    messagingSenderId: "377023861327",
    appId: "1:377023861327:web:2f7488341d1a81ef8d503a"
    
};

// Initialize Firebase
function firebaseInit(){

initializeApp(firebaseConfig)
}

export default firebaseInit



