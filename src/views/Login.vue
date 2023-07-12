<script setup >
    import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
    import { useRouter } from "vue-router";
    import { useStore } from 'vuex'
    import { ref as firebaseRef, getDatabase, get, child } from '@firebase/database';
    import { computed } from "@vue/reactivity";

    console.log("login view running")

    const router = useRouter();
    const store = useStore();
    const dbRef = firebaseRef(getDatabase());

    console.log("dbref at login top" + dbRef)

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        
        signInWithPopup(getAuth(), provider).then((result) => {
            console.log(result.user)
            console.log(result.user.uid)
            console.log(result.user.photoURL)
            store.commit('setUserId', result.user.uid),
            store.commit('setUsername', result.user.displayName),
            store.commit('setUserEmail', result.user.email)
            store.commit('setUserImageUrl', result.user.photoURL)

            console.log("dbref after store.commit" + dbRef)
            router.push('/')
            // get(child(dbRef, `users/` + result.user.uid)).then((snapshot) => {
            //     if (snapshot.exists()) {
            //         console.log("dbref after get request" + dbRef)
            //         console.log(snapshot.val());
            //         store.commit('setIsRegistered', true)
            //         console.log('registered' + computed(() => store.state.isRegistered).value)

            //         if(computed(() => store.state.isRegistered).value == true)
            //         router.push('/q1')
            //         else
            //         router.push('/register')
                    
            //     } else {
            //         console.log("No data available");
            //         router.push('/register')
            //     }
            //     }).catch((error) => {
            //     console.error(error);
            //     });
            
            
            
        }).catch((error) => {
            console.log(error);
        });
    }

</script> 

<template>
    <div style="text-align: center;">
        
        <p>Welcome to contests. Please login and then fill registration details to view and answer questions</p>
        <button style="width: 150px; height: 40px;" @click="signInWithGoogle"> Login with Google </button>
        
    </div>
    
</template>

