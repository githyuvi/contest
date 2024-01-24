<script setup>

import { onMounted, onBeforeMount } from 'vue';
import Header from './components/Header.vue';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useStore } from 'vuex';
import { isUserRegistered } from './utility/Authentication/FirebaseAuthentication';

onBeforeMount(() => {
  console.log("app vue")
})

const store = useStore()
const auth = getAuth()

onBeforeMount(async () => {
  
    onAuthStateChanged(auth, async (user) => {
      console.log("onauth");
        if (user) {
          handleIsLoggedIn(true);
          await handleIsRegistered(user);
        } else {
          
          handleIsLoggedIn(false);
        }
      });


});

const handleIsLoggedIn = (value) => {
    store.commit('setIsLoggedIn', value)
}

const handleIsRegistered = async (user) => {
    let isReg = await isUserRegistered(user)
    store.commit('setIsRegistered', isReg)
}

</script>

<template>
  <router-view />
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

</style>




 