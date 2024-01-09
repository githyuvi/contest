// import functions from firebase database , bundle them into an object and export them

import { getDatabase, get as FirebaseGet , set as FirebaseSet, ref, child } from "firebase/database";

const database = getDatabase();
const dbRef = ref(database)

async function get(path) {
    const snapshot = await FirebaseGet(child(dbRef, path))
    .then((value) => {
        return value.val();
     }).catch((e) => {
        console.log(e);
        return null;
    });
}

async function set(path, value) {
    await FirebaseSet(ref(database, path), value)
    .then(() => {
        console.log("Data set successfully");
        return true;
    }).catch((e) => {
        console.log(e);
        return false;
    });
}

export { get, set }