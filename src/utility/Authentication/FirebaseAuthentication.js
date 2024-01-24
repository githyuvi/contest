// import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';

import { get} from "../Database/FirebaseDatabase"

// import { useRouter } from "vue-router";
// const router = useRouter();

// import { useStore } from 'vuex'
// const store = useStore()


// const auth = getAuth()

// async function logOut() {
//     await signOut(auth).then(async () => {
//       await router.push("/").then((result) => window.location.reload());
  
//     });
// };

async function isUserRegistered(user) {
    let flag = false
    await get(`users/${user.uid}`).then((snapshot) => {
        if (snapshot.status === "success" && snapshot.value !== null) {
            flag = true
        } else {
            flag = false
        }
    })
    return flag
}

// // async function registerUser(user) {
// //     await set(`users/${user.uid}`, {
// //         "name": user.displayName,
// //         "email": user.email,
// //         "photoURL": user.photoURL,
// //         "uid": user.uid,
// //         "lastLogin": new Date().getTime()
// //     }).then((result) => {
// //         if (result) {
// //             return true
// //         } else {
// //             return false
// //         }
// //     })
// // }

// async function onAuthenticationStateChange () {
//     onAuthStateChanged(auth, async (user) => {
//         if (user) {
//           handleIsLoggedIn(true);
//           await handleIsRegistered(user);
//         } else {
          
//           handleIsLoggedIn(false);
//         }
//       });
// }

// const handleIsLoggedIn = (value) => {
//     store.commit('setIsLoggedIn', value)
// }

// const handleIsRegistered = async (user) => {
//     store.commit('setIsRegistered', await isUserRegistered(user))
// }

// export { logOut, onAuthenticationStateChange }
export { isUserRegistered }


