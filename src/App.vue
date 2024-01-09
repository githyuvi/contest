<script setup>

import { onMounted, ref, computed } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { useRouter } from "vue-router";
import { ref as firebaseRef, getDatabase, get, child } from '@firebase/database';
import { useStore } from 'vuex'

import Loading from 'vue-loading-overlay';

const isLoading = ref(false)


const store = useStore()
const dbRef = firebaseRef(getDatabase());
const router = useRouter();

const userImageUrl = computed(() => store.state.userImageUrl)
const isLoggedIn = ref(false);
let auth;

onMounted(async () => {
  console.log('onMounted')
  // console.log($route.meta.hideNavBar)
  isLoading.value = true
  console.log(isLoading.value)
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
  onAuthStateChanged(auth, async (user) => {
    console.log('onauth')
    if (user) {
      isLoggedIn.value = true;
      handleIsLoggedIn();
      await hangelIsRegistered(user);
    } else {
      isLoggedIn.value = false;
      handleIsLoggedIn();
    }
    isLoading.value = false
  });
  
});

const handleSignOut = async () => {
  await signOut(auth).then(async () => {
    await router.push("/").then((result) => window.location.reload());

  });
};

const handleIsLoggedIn = () => {
  store.commit('setIsLoggedIn', isLoggedIn.value)
}

const hangelIsRegistered = async (user) => {
  // console.log('handleisregistered')
  await get(child(dbRef, `users/` + user.uid)).then((snapshot) => {
    // console.log('snapshot', snapshot)
    if (snapshot.exists()) {
      store.commit('setIsRegistered', true)
    } else {
    }
  }).catch((error) => {
    console.error(error);
  });
}

</script>

<template>
  
  <header v-if="!$route.meta.hideNavBar && !isLoading" class="site-header v-cloak">
    <div class="wrapper site-header__wrapper">
      <div class="site-header__start">
        <div><a href="#" class="brand">CMI</a></div>
      
        <a style="font-size: small;" href="#" class="brand">Tomato</a>

      </div>
      <div class="site-header__middle">
        <nav class="nav">
          <button class="nav__toggle" aria-expanded="false" type="button">
            menu
          </button>
          <ul class="nav__wrapper">
            <!-- <li class="nav__item"><router-link to="/"> Home </router-link></li>
            <li class="nav__item"><router-link to="/register"> Register </router-link></li> -->
          </ul>
        </nav>
      </div>
      <div class="site-header__end">
        <div class="loginbuttoncontainer">
        <button v-if="!isLoggedIn"><router-link to="/login"> Login </router-link></button>
        <button @click="handleSignOut" v-if="isLoggedIn"> Sign Out</button>
      </div>
      </div>
    </div>
  </header>
  <div v-if="isLoading" style="display: flex; justify-content: center;align-items: center;">
  <Loading style="position: relative;" :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
</div>
  <router-view />
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
@import 'node_modules/vue-loading-overlay/dist/css/index.css';
[v-cloak]{
  display: none;
}
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline
}

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

ol,
ul {
  list-style: none
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

.wrapper {
  width: 100vw;
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


.brand {
  font-weight: bold;
  font-size: 20px;
}

.site-header {
  position: relative;
  width: 100%;
  background-color: #422d95;
  
}
.site-header *{
  color: white;
}
.site-header__wrapper {
  display: flex;
  width: 100vw;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

@media (min-width: 10px) {
  .site-header__wrapper {
    padding-top: 0;
    padding-bottom: 0;
  }
}


@media (min-width: 10px) {
  .nav__wrapper {
    display: flex;
  }
}

.nav__item a {
  display: block;
  padding: 0.75rem 0.5rem;
}

.nav__toggle {
  display: none;
}

.loginbuttoncontainer button {
    width: max-content;
    padding: 4px 5px;
    color: #422d95; 
    background-color: white;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
}
.loginbuttoncontainer a {
  color: #422d95;
}


</style>




 