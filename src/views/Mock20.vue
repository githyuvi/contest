<script setup>
import { onMounted,ref } from 'vue';
import Contest from '../components/Contest.vue';

import { getDatabase, ref as firebaseRef, get, child, off } from "firebase/database";
import Loading from 'vue-loading-overlay';
import router from '../router';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions()
const checkContestAccess = httpsCallable(functions, 'checkContestAccess',)

const db = getDatabase();
const dbRef = firebaseRef(db);
const disable = ref(true)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const startTime = ref(0)
const onlineEndTime = ref(0)
const offlineStartTime = ref(0)
const offlineEndTime = ref(0)
const submissionType = ref('')
const isAdmin = ref(false)

const isFullPageLoading = ref(false)

onMounted(async() => {
    isFullPageLoading.value = true
    const snapshot = await get(child(dbRef, "livecontestwindow/" + "mock20" + "/" + "examwindow/"))
    const examWindow = snapshot.val()
    console.log('onmounted')

    const result = await checkContestAccess().then((result)=>{
        console.log('snapshot2')
        isAdmin.value = result.data

    
    }).catch(() => {
        console.log('error')
        isFullPageLoading.value = false
        // location.reload()
    
    })

    console.log('checkedcontestaccess')
    
    
    startTime.value = examWindow.starttime
    onlineEndTime.value = examWindow.onlineendtime
    offlineStartTime.value = examWindow.offlinestarttime
    offlineEndTime.value = examWindow.offlineendtime

    const now1 = new Date().getTime();
    if(now1 <= startTime.value)
        submissionType.value = 'Live'
    else if(onlineEndTime.value <= now1 && now1 <= offlineStartTime.value)
        submissionType.value = 'Offline'


    // startTime.value = 1704312480000
    // onlineEndTime.value = 1704312660000
    // offlineEndTime.value = 1704312660000

    if(new Date().getTime() > offlineEndTime.value){
        if(!isAdmin.value){
        await router.push('/').then(() => window.location.reload())
        }
    }
    
    if(startTime.value <= now1 && now1 <= onlineEndTime.value){
        disable.value = false
    }
    else if(offlineStartTime.value <= now1 && now1 <= offlineEndTime.value){
        disable.value = false
    }

    else {
        const timer = setInterval(() => {
        const now = new Date().getTime();

        if(submissionType.value == 'Live')
            var distance = startTime.value - now;
        else if(submissionType.value == 'Offline')
            var distance = offlineStartTime.value - now;

        

        hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds.value = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance <= 0) {
            clearInterval(timer);
            disable.value = false
        }
    }, 1000);
    }
    // timer for starttime
    isFullPageLoading.value = false

})

</script>

<template>
    
        <Contest v-if="isAdmin || !disable" contest-name="mock20" header="Mock 1">
        </Contest>
        

<Loading v-if="!(isAdmin || !disable)" :active="true" :can-cancel="false" :is-full-page="false" :loader="'dots'">
<div class="loading-container">
    <header></header>
    <h1>{{ submissionType }} mock test will start in</h1>
    <h2>{{ hours }}h: {{minutes}}m:{{seconds}}s</h2>
    <button @click="() => router.push('/').then(()=>window.location.reload())">Go Home</button>
</div>
</Loading>

<Loading :active.sync="isFullPageLoading" :can-cancel="true" :is-full-page="true"></Loading>


</template>



<style scoped>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';

.mock-contest-style {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    
    flex-direction: column;
    align-items: center;
    background-color: rgb(241, 241, 241);
    min-height: 100vh;
    max-width: 700px;
}

.container {
    text-align: center;
}

h2 {
    color: rgb(169, 169, 169);
    margin: 1px;
    background-color: white;
    padding: 2px 4px;
    color: #422d95;
}


.loading-container {
    background-image: url('/loading_background.jpeg');
    background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

h1 {
  font-size: 24px;
  color: rgb(0, 66, 116);
  background-color: aliceblue;
  padding: 2px 4px;
  border-radius: 2px;
  margin: 2px;
}

.loading-container button {
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 16px;
  cursor: pointer;
    border-radius: 10px;
    border: 1px solid darkgreen;
    background-color: white;
    color: rgb(2, 58, 2);

}

</style>