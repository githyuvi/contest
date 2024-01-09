<script setup>
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "@firebase/auth";
import { useRouter } from "vue-router";
import { useStore } from 'vuex'
import { computed, onMounted, reactive, ref } from "vue";
import {
    getDatabase,
    ref as firebaseRef,
    set,
    get,
    child,
} from "firebase/database";
import { getFunctions, httpsCallable } from 'firebase/functions';
import Loading from 'vue-loading-overlay';

const router = useRouter();
const store = useStore();
const dbRef = firebaseRef(getDatabase());
const functions = getFunctions()

const getEvaluators = httpsCallable(functions, 'getEvaluators')
const getContests = httpsCallable(functions, 'getContests')
const getContestSubmissions = httpsCallable(functions, 'getContestSubmissions')
const setEvaluationAccess = httpsCallable(functions, 'setEvaluationAccess')

const isLoggedIn = ref(false);
let auth;
let evaluators = reactive([])
const isLoading = ref(false)
const fullPage = ref(true)

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(getAuth(), provider).then(async (result) => {
        store.commit('setUserId', result.user.uid),
            store.commit('setUsername', result.user.displayName),
            store.commit('setUserEmail', result.user.email)
        store.commit('setUserImageUrl', result.user.photoURL)

        await router.push("/admin").then((result) => window.location.reload());

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
    await getEvaluators().then((result) => {
        //convert result data into array
        const data = result.data
        const keys = Object.keys(data)
        const values = Object.values(data)
        for (let i = 0; i < keys.length; i++) {
            const element = keys[i];
            const value = values[i]
            evaluators.push({
                id: element,
                value: value
            })
        }
        isLoading.value = false

    }).catch((error) => {
        console.log('error', error.message)
        isLoading.value = false
    }
    )
    await getContests().then((result) => {
        //convert result data into array
        const data = result.data
        const keys = Object.keys(data)
        const values = Object.values(data)
        for (let i = 0; i < keys.length; i++) {
            const element = keys[i];
            const value = values[i]
            contests.push({
                name: element,
                value: value
            })
        }
        isLoading.value = false

    }).catch((error) => {
        console.log('error', error.message)
        isLoading.value = false
    }
    )
}
    

});

const handleSignOut = async () => {
    await signOut(auth).then(async () => {
        await router.push("/admin").then((result) => window.location.reload());

    });
};

const handleIsLoggedIn = () => {
    store.commit('setIsLoggedIn', isLoggedIn.value)
}
const contests = reactive([]);
const selectedEvaluator = ref(null);
const selectedContest = ref(null);
const selectedUsers = ref([])
const selectedQuestions = ref([])
const users = reactive([])

const editAccess = (evaluator) => {
    selectedEvaluator.value = evaluator;
    document.getElementById('confirmModal').style.display = 'block';
    // Fetch evaluator's access details (contests, questions, submissions) here
    // Set selectedContest, selectedQuestions, etc. based on evaluator's access
    // Example: selectedContest.value = evaluator.contestAccess;
};

const saveAccess = async() => {
    // Save changes to evaluator's access to the database
    // Example: update evaluator's contest access with selectedContest.value
    // Update other access details as needed
    await setEvaluationAccess({evaluatorId:selectedEvaluator.value.id, contestName:selectedContest.value.name , questionNumbers: selectedQuestions.value, studentIds: selectedUsers.value})
        .then((result) => {
            console.log('value', result)
        })
        .catch((e) => {
            console.log(e.message);
        });
    closeModal();
};

const closeModal = () => {
    document.getElementById('confirmModal').style.display = 'none';
    selectedEvaluator.value = null;
    selectedContest.value = null;
    selectedQuestions.value = [];
    selectedUsers.value = [];
    users.splice(0,users.length)
    // Clear other selected access details
};

const initializeContestData = async(value) => {
    for(let i = 0;i<selectedContest.value.value.questions.length;i++){
        selectedQuestions.value[i] = i + 1
    }
    isLoading.value = true
    await getContestSubmissions({contestName:selectedContest.value.name}).then((result) => {
        const data = result.data
        console.log('data', data)
        if(data != null){
        const keys = Object.keys(data)
        const values = Object.values(data)
        for (let i = 0; i < keys.length; i++) {
            const element = keys[i];
            const value = values[i]
            users.push(element)
        }
        selectedUsers.value = users
    }
        isLoading.value = false


    }).catch((error) => console.log('error', error.message)
    )
}

const showSelectedQuestions = (value) => {
    console.log('show Selected Questions',  selectedQuestions)
}
const showSelectedUsers = (value) => {
    console.log('show Selected Users',  selectedUsers)
}


</script>

<template>
    <header class="site-header">
        <div class="wrapper site-header__wrapper">
            <div class="site-header__start">
                <a href="#" class="brand">Admin</a>

            </div>
            <div class="site-header__middle">
                <nav class="nav">
                    <button class="nav__toggle" aria-expanded="false" type="button">
                        menu
                    </button>
                    <ul class="nav__wrapper">
                        <li class="nav__item"><router-link to="/"> AdminHome </router-link></li>
                    </ul>
                </nav>
            </div>
            <div class="site-header__end">
                <button v-if="!isLoggedIn" @click="signInWithGoogle">Login</button>
                <button @click="handleSignOut" v-if="isLoggedIn"> Sign Out</button>
            </div>
        </div>
    </header>
    <br>
    <div v-for="evaluator in evaluators" :key="evaluator.id" class="evaluator">
        <h1>{{ evaluator.value.evaluatorName }}</h1>
        <p>Email: {{ evaluator.value.email }}</p>
        <button @click="editAccess(evaluator)">Edit Access</button>
        <hr />
    </div>

    <!-- Modal for editing access -->

    <div class="modal" id="confirmModal">
        <div class="modal-content" v-if="selectedEvaluator">
            <h2>Edit Evaluation Access for</h2>
            <!-- Edit access form or options -->
            <!-- Example: -->
            <h3>{{ selectedEvaluator.value.evaluatorName }}</h3>
            <p>Email: {{ selectedEvaluator.value.email }}</p>
            <br>
            <label for="contestAccess">Select Contest</label>
            <select @change="initializeContestData" v-model="selectedContest" id="contestAccess" >
                <option v-for="contest,i in contests" :key="i" :value="contest">{{ contest.name }}</option>
            </select>
            <br>
            <label for="questionAccess">Select questions</label>
            <select @change="showSelectedQuestions" v-model="selectedQuestions" v-if="selectedContest" id="questionAccess" multiple>
                <option v-for="question,i in selectedContest.value.questions" :key="i" :value="i + 1">{{ i + 1 }}</option>
            </select>
            <br>
            <label for="usersAccess">Select users</label>
            <select @change="showSelectedUsers" v-model="selectedUsers" v-if="selectedContest" id="usersAccess" multiple>
                <option v-for="user,i in users" :key="i" :value="user">Student {{ i + 1 }}</option>
            </select>

            <br>
            <br>
            <!-- Add more access options (questions, submissions) as needed -->

            <button @click="saveAccess">Save</button>
            <button @click="closeModal">Close</button>
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

.evaluator {
    padding: 10px;
}

.modal {
    display: none;
    /* Hide the modal by default */
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent background */
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
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