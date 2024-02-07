// // import functions from firebase database , bundle them into an object and export them

import { getDatabase, get as FirebaseGet , set as FirebaseSet, ref, child } from "firebase/database";
import firebaseInit from "../"

    firebaseInit()
    const database = getDatabase()
    const dbRef = ref(database)

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