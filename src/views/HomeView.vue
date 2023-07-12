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
        <div class="contest-list">
        <div class="contest-section">
            <h2>Ongoing Contests</h2>
            <div class="contest">
                <div class="title"><router-link to="/live1"> Live 1 </router-link></div>
                <div class="description">Description of Live 1</div>
                <div class="date">Started: May 10, 2023</div>
            </div>
        </div>
    </div>
        
    </div>
    
</template>

<style scoped>
    body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        
        h1 {
            text-align: center;
        }
        
        .contest-list {
            margin-top: 30px;
        }
        
        .contest-section {
            margin-bottom: 30px;
        }
        
        .contest-section h2 {
            margin-bottom: 10px;
        }
        
        .contest {
            background-color: #f5f5f5;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
        }
        
        .contest .title {
            font-size: 18px;
            font-weight: bold;
        }
        
        .contest .description {
            font-size: 14px;
            margin-top: 5px;
        }
        
        .contest .date {
            font-size: 12px;
            margin-top: 5px;
        }
</style>