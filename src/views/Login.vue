<script setup >
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "@firebase/auth";
import { useRoute, useRouter } from "vue-router";
import { useStore } from 'vuex'
import { ref as firebaseRef, getDatabase, get, child } from '@firebase/database';
import { computed, ref } from "vue";

const router = useRouter();
const route = useRoute();
const store = useStore();
const dbRef = firebaseRef(getDatabase());
const auth = getAuth();
const email = ref('');
const password = ref('');

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider).then(async (result) => {
        store.commit('setUserId', result.user.uid),
            store.commit('setUsername', result.user.displayName),
            store.commit('setUserEmail', result.user.email)
        store.commit('setUserImageUrl', result.user.photoURL)

    await afterSignIn(result.user.uid)

    }).catch((error) => {
        console.log(error);
    });
}

const signInWithEmailAndPasswordCustom = async(email,password) => {
    console.log('email', email);
    console.log('password', password);
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('user', user);
        store.commit('setUserId', user.uid),
        store.commit('setUsername', user.displayName),
        store.commit('setUserEmail', user.email)
        store.commit('setUserImageUrl', user.photoURL)
        // ...

        await afterSignIn(user.uid)
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

const afterSignIn = async(uid) => {
    await get(child(dbRef, `users/` + uid)).then((snapshot) => {
            // console.log('snapshot', snapshot)
            if (snapshot.exists()) {
                store.commit('setIsRegistered', true)
                // console.log('registered')
            } else {
            }
        }).catch((error) => {
            console.error(error);
        });
        // console.log('redirect link', route.query.redirect)
        if (route.query.redirect) {
            // await window.location.reload()
            await router.push(route.query.redirect);

            // Redirect to the intended page
        } else {
            // If no intended page was provided, redirect to a default route
            if(computed(() => store.state.isRegistered).value)
            await router.push('/');
            else
            await router.push('/register');
        }
}

</script> 

<template>
    <header style="height: 50px; width: 100%; background-color: #422d95;"></header>
    <div class="loginpage" style="text-align: center;">

        <button class="gsi-material-button" @click="signInWithGoogle">
            <div class="gsi-material-button-state"></div>
            <div class="gsi-material-button-content-wrapper">
                <div class="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                        xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                        <path fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z">
                        </path>
                        <path fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z">
                        </path>
                        <path fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z">
                        </path>
                        <path fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z">
                        </path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </div>
                <span class="gsi-material-button-contents">Continue with Google</span>
                <span style="display: none;">Continue with Google</span>
            </div>
        </button>
        <br><br>
        <!-- create a login with emailid and password form-->
        <p>Or login with email and password</p>
        <form @submit.prevent="() => signInWithEmailAndPasswordCustom(email,password)">
            <input v-model="email" type="email" placeholder="Email" style="padding: 10px; margin: 10px; border-radius: 5px;">
            <input v-model="password" type="password" placeholder="Password" style="padding: 10px; margin: 10px; border-radius: 5px;">
            <button style="padding: 10px; margin: 10px; border-radius: 5px; background-color: #422d95; color: white;">Login</button>
        </form>
        <p>Admin Credentials</p>
        <p>Email: vuemock1@gmail.com</p>
        <p>Password: VueExamAdmin21*</p>



    </div>
</template>

<style>
@import '../assets/googlesigninbutton.css';

.loginpage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 50px);
    background-color: lightgray;
}
</style>
