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
    apiKey: "AIzaSyDwJC6-EJda4wWYngksM5ZVV1hmCsCx5sA",
    authDomain: "vueexam-15ff4.firebaseapp.com",
    projectId: "vueexam-15ff4",
    storageBucket: "vueexam-15ff4.appspot.com",
    messagingSenderId: "761721594237",
    appId: "1:761721594237:web:eda28fdedaf5ed63526c14"
  };

// Initialize Firebase
initializeApp(firebaseConfig);

console.log('firebase init')

const app = createApp(App)

app.use(router)
app.use(store)
app.use(VueMathjax)
app.mount('#app')