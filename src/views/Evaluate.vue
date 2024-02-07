<script setup>
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "@firebase/auth";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
import { computed, onMounted, reactive, ref } from "vue";
import { getDownloadURL, getStorage, ref as firebaseStorageRef } from "firebase/storage";
import {
    getDatabase,
    ref as firebaseRef,
    set,
    get,
    child,
} from "firebase/database";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import ImageFirebase from "../components/ImageFirebase.vue";
import Loading from "vue-loading-overlay";


const router = useRouter();
const store = useStore();
const dbRef = firebaseRef(getDatabase());
const functions = getFunctions()
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

const storage = getStorage()
const data = ref({})

const isLoading = ref(false)
const fullPage = ref(true)

const getAnswersForEvaluation = httpsCallable(functions, 'getAnswersForEvaluation')
const updateEvaluatedScore =  httpsCallable(functions, 'updateEvaluatedScore')
const isLoggedIn = ref(false);
let auth;

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(getAuth(), provider).then(async (result) => {
        store.commit('setUserId', result.user.uid),
            store.commit('setUsername', result.user.displayName),
            store.commit('setUserEmail', result.user.email)
        store.commit('setUserImageUrl', result.user.photoURL)

        const userId = computed(() => store.state.userId)
        await get(child(dbRef, "evaluators/" + userId.value + "/registered"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const isEvaluatorRegistered = snapshot.val();
                    if (isEvaluatorRegistered) {
                        router.push("/evaluate").then((result) => window.location.reload());
                    } else {
                        router.push('/evaluatorregister')
                    }
                }
                else {
                    router.push('/evaluatorregister')
                }
            })
            .catch((error) => {
                console.log('error', error.message);
                alert("couldn't fetch results");
            });

    }).catch((error) => {
        console.log(error);
    });
}

onMounted(async () => {
    let navToggle = document.querySelector(".nav__toggle");
    let navWrapper = document.querySelector(".nav__wrapper");
    navToggle.addEventListener("click", function () {
        if (navWrapper.classList.contains("active")) {
            this.setAttribute("aria-expanded", "false");
            this.setAttribute("aria-label", "menu");
            navWrapper.classList.remove("active");
        } else {
            navWrapper.classList.add("active");
            this.setAttribute("aria-label", "close menu");
            this.setAttribute("aria-expanded", "true");
        }
    });

    navWrapper.addEventListener("click", function () {
        if (navWrapper.classList.contains("active")) {
            this.setAttribute("aria-expanded", "false");
            this.setAttribute("aria-label", "menu");
            navWrapper.classList.remove("active");
        } else {
            navWrapper.classList.add("active");
            this.setAttribute("aria-label", "close menu");
            this.setAttribute("aria-expanded", "true");
        }
    })

    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            isLoggedIn.value = true;
            handleIsLoggedIn();
        } else {
            isLoggedIn.value = false;
            handleIsLoggedIn();
        }
    });
    if(computed(() => store.state.isLoggedIn).value == true){
    isLoading.value = true
    await getAnswersForEvaluation().then((result) => {
        const resultData = result.data
        for(const contestId in resultData) {
            let contestName = contestId
            let contestSubmissions = resultData[contestId]
            let userIdOjbect = {}
            for(const userId in contestSubmissions){
                let userAnswers = contestSubmissions[userId]
                let userAnswersObject = {}
                for(const qn in userAnswers){
                    let answer = userAnswers[qn]
                    if(answer == 'not submitted'){
                        continue
                    }
                    if(answer['images'] != null && answer['options'] == null){
                        userAnswersObject[qn] = answer['images']
                    }
                }
                userIdOjbect[userId] = userAnswersObject
            }
            data.value[contestName] = userIdOjbect

        }
        for(const contestName in data.value){
            userMarks.value[contestName] = {}
            for(const userId in data.value[contestName]){
                userMarks.value[contestName][userId] = {}
            }
        }
        isLoading.value = false
    }).catch((error) => {
        console.log('error', error)
    
    })
}
});

const handleSignOut = async () => {
    await signOut(auth).then(async () => {
        await router.push("/evaluate").then((result) => window.location.reload());

    });
};

const handleIsLoggedIn = () => {
    store.commit('setIsLoggedIn', isLoggedIn.value)
}

const userMarks = ref({})

function handleMarksChange(userId, qn, contestName, event){
    userMarks.value[contestName][userId][qn] = event.target.value
}

async function updateScore(userId, contestName){
    isLoading.value = true
    let scores = {"subjective": userMarks.value[contestName][userId]}
    console.log('scores', scores)
    await updateEvaluatedScore({contestName:contestName, studentId:userId, score:scores}).then((res) => {
        console.log(res)
    }).catch((error) => {
        console.log(error)
    
    })

    isLoading.value = false
}

</script>

<template>
    <header class="site-header">
        <div class="wrapper site-header__wrapper">
            <div class="site-header__start">
                <a href="#" class="brand">Vue Exams Evaluators</a>

            </div>
            <div class="site-header__middle">
                <nav class="nav">
                    <button class="nav__toggle" aria-expanded="false" type="button">
                        menu
                    </button>
                    <ul class="nav__wrapper">
                        <li class="nav__item"><router-link to="/evaluate"> EvaluatorHome </router-link></li>
                        <li class="nav__item"><router-link to="/evaluatorregister"> EvaluatorsRegistration </router-link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="site-header__end">
                <button v-if="!isLoggedIn" @click="signInWithGoogle">Login</button>
                <button @click="handleSignOut" v-if="isLoggedIn"> Sign Out</button>
            </div>
        </div>
    </header>
    
    <div>
        <div v-for="userData, contestName in data">
            {{ contestName }} 
            <div v-for="userAnswers, userId, index in userData">
                <div v-if="Object.keys(userAnswers).length > 0">
                Student {{ index + 1 }}
                <div v-for="answer, qn in userAnswers">
                    Question {{ qn }}
                    <image-firebase :image="answer"> </image-firebase>
                    <label for="remarks"> Remarks </label>
                    <input type="text" id="remarks">
                    <label for="marks"> Marks </label>
                    <input @input="(value) =>handleMarksChange(userId,qn,contestName ,value)" type="number">
                    
                </div>
                <button @click="() => updateScore(userId, contestName)"> Update Score for Student {{ index+1 }}</button>
            </div>
            </div>

        </div>
    </div>
    <div class="vld-parent">
    <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>

    </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
@import 'node_modules/vue-loading-overlay/dist/css/index.css';


article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
    display: block
}

body {
    line-height: 1
}



blockquote,
q {
    quotes: none
}

blockquote:before,
blockquote:after,
q:before,
q:after {
    content: '';
    content: none
}

table {
    border-collapse: collapse;
    border-spacing: 0
}

.sign-out-button {
    background-color: #def7ff;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    color: #000;
    font-weight: bold;
    cursor: pointer;
}

.wrapper {
    max-width: 1140px;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-left: auto;
    margin-right: auto;
}

*,
*:before,
*:after {
    box-sizing: border-box;
}

a {
    text-decoration: none;
    color: #222;
}

html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    font-family: "Roboto", sans-serif;
}

.sr-only {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
}

.button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    color: #fff;
    background-color: #2fa0f6;
    min-width: 120px;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    text-align: center;
}

.button svg {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    fill: #fff;
}

.button span {
    display: none;
}

@media (min-width: 600px) {
    .button span {
        display: initial;
    }
}

.button--icon {
    min-width: initial;
    padding: 0.5rem;
}

.brand {
    font-weight: bold;
    font-size: 20px;
}

.site-header {
    position: relative;
    background-color: #def7ff;
}

.site-header__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

@media (min-width: 660px) {
    .site-header__wrapper {
        padding-top: 0;
        padding-bottom: 0;
    }
}

@media (max-width: 659px) {
    .site-header__end {
        padding-right: 4rem;
    }
}

@media (min-width: 660px) {
    .nav__wrapper {
        display: flex;
    }
}

@media (max-width: 659px) {
    .nav__wrapper {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        z-index: 1;
        background-color: #d9f0f7;
        visibility: hidden;
        opacity: 0;
        transform: translateY(-100%);
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    }

    .nav__wrapper.active {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
    }
}

.nav__item a {
    display: block;
    padding: 1.5rem 1rem;
    
}
.nav__item {
    list-style: none;
}

.nav__toggle {
    display: none;
}

@media (max-width: 659px) {
    .nav__toggle {
        display: block;
        position: absolute;
        right: 1rem;
        top: 1rem;
    }
}
</style>