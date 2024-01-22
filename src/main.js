import { createApp } from 'vue'
import VueMathjax from 'vue-mathjax-next';
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from "firebase/app";
import './assets/main.css'

// TODO: Add SDKs for Firebase products that you want to use
// [https://firebase.google.com/docs/web/setup#available-libraries](https://firebase.google.com/docs/web/setup#available-libraries)

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
initializeApp(firebaseConfig);

console.log('firebase init')

const app = createApp(App)

app.use(router)
app.use(store)
app.use(VueMathjax)
app.mount('#app')