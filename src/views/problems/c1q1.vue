
<script setup>
    import { ref, onMounted, onUnmounted, computed } from "vue";
    // import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
    import { useRouter } from "vue-router";

    import { useStore } from 'vuex'
    import { getDatabase, ref as firebaseRef, set, get, child } from "firebase/database";

    const db = getDatabase();
    const dbRef = firebaseRef(db);
  
    const store = useStore()

    // import { isLoggedIn } from "../App.vue";

//     defineProps({
//   isLoggedin: {
//     type: ref,
//     required: true
//   }
// })

    const receivedIsRegistered = computed(() => store.state.isRegistered)

    const userId = computed(() => store.state.userId)
    const userName = computed(() => store.state.userName)
    const userEmail = computed(() => store.state.userEmail)

    const router = useRouter();

    const question1 = ref('')
    const checkeda = ref(false)
    const checkedb = ref(false)
    const checkedc = ref(false)
    const checkedd = ref(false)

    const initializeOptions = () => {
        get(child(dbRef, `q1/` + userId.value + '/q1')).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val())

                    var value = snapshot.val()

                    switch (value) {
                        case 'a':
                            checkeda.value = true
                            break;
                        
                        case 'b':
                        checkedb.value = true
                        break;

                        case 'c':
                        checkedc.value = true
                        break;

                        case 'd':
                        checkedd.value = true
                        break;
                    
                        default:
                            break;
                    }
                    
                } else {
                    console.log('snapshot doesnt exist')
                }
                }).catch((error) => {
                console.error(error);
                });
    }

    initializeOptions();
    const nextpage = () => {
        router.push('/q2');
    }

    const submitForm = () => {
        console.log(question1)

        set(firebaseRef(db, 'q1/' + userId.value), {
        username: userName.value,
        email: userEmail.value,
        q1: question1.value
  }).then((value) => {
//   console.log('set value' + value)
    nextpage();
   }, ).catch((e) => {
    console.log(e.message);
    alert("Submit error. Couldn't submit the answer")
  });
    }

    
  
</script>

<template >
    <h2>Q1. What is the capital of France?</h2>
    <!-- <p><button @click="signInWithGoogle">Sign In With Google</button></p> -->

<form @submit.prevent="submitForm" >
    <input type="radio" id="paris" name="capital" value="a" v-model="question1" :checked="checkeda">
    <label for="paris">Paris</label><br>
    <input type="radio" id="berlin" name="capital" value="b" v-model="question1" :checked="checkedb">
    <label for="berlin">Berlin</label><br>
    <input type="radio" id="london" name="capital" value="c" v-model="question1" :checked="checkedc">
    <label for="london">London</label><br>
    <input type="radio" id="madrid" name="capital" value="d" v-model="question1" :checked="checkedd">
    <label for="madrid">Madrid</label><br>
    <input type="submit" value="Save & Next" v-if="receivedIsRegistered">
</form>

<!-- <button onclick="window.location.href='./questions/q1.html'" class="w drum">Previous</button> -->
<button @click="nextpage">Next</button>
</template>

<style>
    [v-cloak] {
  display: none;
}
</style>