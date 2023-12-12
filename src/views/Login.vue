<script setup >
    import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
    import { useRouter } from "vue-router";
    import { useStore } from 'vuex'
    import { ref as firebaseRef, getDatabase, get, child } from '@firebase/database';

    const router = useRouter();
    const store = useStore();
    const dbRef = firebaseRef(getDatabase());

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        
        signInWithPopup(getAuth(), provider).then((result) => {
            store.commit('setUserId', result.user.uid),
            store.commit('setUsername', result.user.displayName),
            store.commit('setUserEmail', result.user.email)
            store.commit('setUserImageUrl', result.user.photoURL)
            router.push('/')
            
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

