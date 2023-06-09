
<script setup>

import { onMounted, ref, computed } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { useRouter } from "vue-router";
import { ref as firebaseRef, getDatabase, get, child } from '@firebase/database';
import { useStore } from 'vuex'

console.log('app.vue running')
const store = useStore()
const dbRef = firebaseRef(getDatabase());
const router = useRouter();

const userImageUrl = computed(() => store.state.userImageUrl)
const isLoggedIn = ref(false);
let auth;






onMounted(() => {

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

navWrapper.addEventListener("click", function() {
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

  console.log('onmounted called')
  // console.log('userImageUrl' + userImageUrl)
  auth = getAuth();
  onAuthStateChanged(auth,(user)=> {
    if (user) {
      isLoggedIn.value = true;
      handleIsLoggedIn();
      hangelIsRegistered(user);
    } else {
      isLoggedIn.value = false;
      handleIsLoggedIn();
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    store.commit('setIsRegistered', false)
    store.commit('setUserId','df')
    router.push("/").then((result) => window.location.reload());
  });
};

const handleIsLoggedIn = () => {
    store.commit('setIsLoggedIn', isLoggedIn.value)
    // store.commit('setUserId', user),
    // store.commit('setUsername', isLoggedIn.value),
    // store.commit('setUserEmail', isLoggedIn.value)
  }

const hangelIsRegistered = (user) => {
  get(child(dbRef, `users/` + user.uid)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
    store.commit('setIsRegistered', true)
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
}
  

</script>

<template>

<header class="site-header">
      <div class="wrapper site-header__wrapper">
        <div class="site-header__start">
          <a href="#" class="brand">CNI</a>
          
        </div>
        <div class="site-header__middle">
          <nav class="nav">
            <button class="nav__toggle" aria-expanded="false" type="button">
              menu
            </button>
            <ul class="nav__wrapper">
              <li class="nav__item"><router-link to="/"> Home </router-link></li>
              <li class="nav__item"><router-link to="/poll"> Poll </router-link></li>
              <li class="nav__item"><router-link to="/pollresults"> Poll Results </router-link></li>
              <!-- <li class="nav__item"><router-link to="/q4"> Q4 </router-link></li> -->
            </ul>
          </nav>
        </div>
        <div class="site-header__end">
          <button @click="handleSignOut" v-if="isLoggedIn"> Sign Out</button>
          <img  :src="userImageUrl" alt="userphoto" v-if="isLoggedIn" style="height: 32px; width: 32px; margin-left: 10px;">
        </div>
      </div>
</header>

    <router-view />

    
</template>



<style scoped>


/* header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 2rem;
  text-align: center;
  margin: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 1rem;
  border: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

/* @media (min-width: 1024px) { */
  /* header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  } */

  /* .logo {
    margin: 0 2rem 0 0;
  } */

  /* header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  } */
/* } */

@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:'';content:none}table{border-collapse:collapse;border-spacing:0}



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
  font-size: 20px; }

.site-header {
  position: relative;
  background-color: #def7ff; }

.site-header__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem; }
  @media (min-width: 660px) {
    .site-header__wrapper {
      padding-top: 0;
      padding-bottom: 0; } }
@media (max-width: 659px) {
  .site-header__end {
    padding-right: 4rem; } }

@media (min-width: 660px) {
  .nav__wrapper {
    display: flex; } }

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
    transition: transform 0.3s ease-out, opacity 0.3s ease-out; }
    .nav__wrapper.active {
      visibility: visible;
      opacity: 1;
      transform: translateY(0); } }

.nav__item  a {
  display: block;
  padding: 1.5rem 1rem; }

.nav__toggle {
  display: none; }
  @media (max-width: 659px) {
    .nav__toggle {
      display: block;
      position: absolute;
      right: 1rem;
      top: 1rem; } }


</style>




 