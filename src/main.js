
import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// import VueScrollTo from 'vue-scrollto';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

 
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


console.log("main running")
// TODO: Add SDKs for Firebase products that you want to use
// [https://firebase.google.com/docs/web/setup#available-libraries](https://firebase.google.com/docs/web/setup#available-libraries)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    
    apiKey: "AIzaSyBS5C8p33p3bQHVE3r2IlM_XY5hJukuBZs",
    authDomain: "fir-algomuse.firebaseapp.com",
    databaseURL: "https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-algomuse",
    storageBucket: "fir-algomuse.appspot.com",
    messagingSenderId: "377023861327",
    appId: "1:377023861327:web:2f7488341d1a81ef8d503a"
};

// Initialize Firebase
initializeApp(firebaseConfig);
console.log('firebase')
// const analytics = getAnalytics(app);

const app = createApp(App)

app.use(router)
app.use(store)
// app.use(mavonEditor)


console.log('app.use router store')
app.mount('#app')
console.log('app.mount');
