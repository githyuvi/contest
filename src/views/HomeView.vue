<script setup>
// import { onMounted, ref } from 'vue';

// import { getDatabase, ref as firebaseRef, get, child, off } from "firebase/database";

// import {get as modGet } from "../utility/Database/FirebaseDatabase"
// const startTime = ref(0)
// const onlineEndTime = ref(0)
// const offlineEndTime = ref(0)
// const submissionType = ref('')

// const db = getDatabase();
// const dbRef = firebaseRef(db);
// const downloaded = ref(false)

// onMounted(async () => {
    
//     const snapshot = await get(child(dbRef, "livecontestwindow/" + "mock" + "/" + "examwindow/"))
//     const examWindow = snapshot.val()

//     startTime.value = examWindow.starttime
//     onlineEndTime.value = examWindow.onlineendtime
//     offlineEndTime.value = examWindow.offlineendtime

//     // startTime.value = 1704314220000
//     // onlineEndTime.value = 1704314280000
//     // offlineEndTime.value = 1704314340000

//     const ct = new Date().getTime()
//         if (startTime.value <= ct && ct <= onlineEndTime.value)
//             submissionType.value = 'live'
//         else if (onlineEndTime.value < ct && ct <= offlineEndTime.value)
//             submissionType.value = 'offline'
//         else if (ct < startTime.value)
//             submissionType.value = 'Not Yet Started'
//         else
//             submissionType.value = 'Ended'

//     const timer2 = setInterval(() => {
//         const ct = new Date().getTime()
//         if (startTime.value <= ct && ct <= onlineEndTime.value)
//             submissionType.value = 'live'
//         else if (onlineEndTime.value < ct && ct <= offlineEndTime.value)
//             submissionType.value = 'offline'
//         else if (ct < startTime.value)
//             submissionType.value = 'Not Yet Started'
//         else
//             submissionType.value = 'Ended'

//         if(submissionType.value == 'Ended'){
//             clearInterval(timer2)
//         }
//     }, 30000)

//     downloaded.value = true

// })

import { ref } from 'vue';
import Header from '../components/Header.vue';
function handleOnAnswerChange(value) {
    console.log(value)
}

const answer = ref(4)
</script>

<template>
   <div>
    <Header></Header>
    HomeView
    <RouterLink to="'exam/mock20'">Mock 20</RouterLink>
    <!-- <NumericAnswer :answer-chosen="answer" @on-answer-change="handleOnAnswerChange"></NumericAnswer>
    <DescriptiveAnswer :files-uploaded="[]" @on-files-change="(value) => console.log(value)"></DescriptiveAnswer> -->
    
   </div>
   


    <!-- <div>
        <ImagePreview></ImagePreview>
    </div> -->
</template>

<style scoped>
    
</style>