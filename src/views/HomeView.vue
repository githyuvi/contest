<script setup>



import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";

console.log("Home View running")
const router = useRouter();
const store = useStore();

const receivedIsRegistered = computed(() => store.state.isRegistered)
const receivedIsLoggedIn = computed(() => store.state.isLoggedIn)

const login = () => {
    router.push('./login')
}


</script>

<template>
    <div style="text-align: center;">
        
        <p>Welcome to contests. Please login and then fill registration details to view and answer questions</p>
        <button style="width: 150px; height: 40px;" @click="login" v-if="!receivedIsLoggedIn"> Login/Register </button>
        
    </div>
    
</template>