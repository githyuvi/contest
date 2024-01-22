// // import functions from firebase database , bundle them into an object and export them

import { getDatabase, get as FirebaseGet , set as FirebaseSet, ref, child } from "firebase/database";
import firebaseInit from "../"
// import { useStore } from "vuex";
// import { computed } from "vue";

// import { initializeApp } from "firebase/app";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
    
//     apiKey: "AIzaSyBS5C8p33p3bQHVE3r2IlM_XY5hJukuBZs",
//     authDomain: "poll.cmientranceexam.in",
//     databaseURL: "https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "fir-algomuse",
//     storageBucket: "fir-algomuse.appspot.com",
//     messagingSenderId: "377023861327",
//     appId: "1:377023861327:web:2f7488341d1a81ef8d503a"
    
// };

// // Initialize Firebase
// const fbApp = initializeApp(firebaseConfig);
// console.log("inside datqbae")

// const database = getDatabase(fbApp)

    firebaseInit()
    const database = getDatabase()
    const dbRef = ref(database)

    // console.log('inside database')

async function get(path) {
    try {
        const snapshot = await FirebaseGet(child(dbRef, path));
        return {"status": "success", "value":snapshot.val()};
    } catch (e) {
        return {"status": "error", "value":e};
    }
}

async function set(path, value) {
    try {
        await FirebaseSet(ref(database, path), value);
        console.log("Data set successfully");
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export { get, set }