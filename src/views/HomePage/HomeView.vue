<script setup>

import { ref, onBeforeMount } from 'vue';
import Header from '../../components/Header.vue';
import ExamDetails from './ExamDetails.vue';
import axios from 'axios';
import Loading from 'vue-loading-overlay'

const activeExams = ref([])
const archivedExams = ref([])
const isLoading = ref(false)
const BASE_URL = import.meta.env.VITE_BASE_URL
const AUTH = import.meta.env.VITE_AUTH

async function fetchActiveExams(){
    isLoading.value = true
    const repData = await axios.get(`${BASE_URL}/livecontestwindow.json?${AUTH}`)
    // make an array of keys
    var keys = []
    if(repData.data) keys = Object.keys(repData.data)
    let arr = []
    for(let i = 0;i<keys.length;i++){
        arr.push(keys[i])
    }
    activeExams.value = arr
    isLoading.value = false
}

async function fetchArchivedExams(){
    try{
    isLoading.value = true
    const repData = await axios.get(`${BASE_URL}/archivedcontest.json?${AUTH}`)
    // make an array of keys
    if(repData.data == null) {
        isLoading.value = false
        return
    }
    var keys = []
    if(repData.data) keys = Object.keys(repData.data)
    let arr = []
    for(let i = 0;i<keys.length;i++){
        arr.push(keys[i])
    }
    archivedExams.value = arr
    isLoading.value = false
}
catch(e){
    console.log(e)
    isLoading.value = false
}
}

onBeforeMount(async() => {
      await fetchActiveExams()
      await fetchArchivedExams()
})

</script>

<template>
   <div>
      <Header></Header>
      <h1 class="text-center text-3xl m-4">Active Exams</h1>
      <div v-for="examName,index in activeExams" :key="index">
         <ExamDetails :contest-name="examName" :contest-type="'livecontest'"></ExamDetails>
      </div>
      <hr>
      <hr>

      <h1 class="text-center text-3xl m-4">Archived Exams</h1>
      <div v-for="examName,index in archivedExams" :key="index">
         <ExamDetails :contest-name="examName" :contest-type="'archivedcontest'"></ExamDetails>
      </div>
      <div v-if="archivedExams.length<=0">
            <h3 class="text-center text-red-500 text-lg m-4">No Archived Exams</h3>
    </div>
    
   </div>
   <div class="flex items-center justify-center h-screen">
        <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
    </div>
</template>

<style scoped>
    
</style>