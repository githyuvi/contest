<template>
<div v-if="canViewExam">
    <ExamWindow :contest-start-time="contestStartTime" :contest-end-time="contestEndTime" :contest-name="contestName" :contest-type="'livecontest'" :submission-type="submissionType"></ExamWindow>
</div>
<div v-else-if="loadingContainerSubmissionType == 'Live' || loadingContainerSubmissionType == 'Offline'">
    <LoadingContainer @timer-over="async() => await handleLoadingTimerOver()" :start-time="startTime" :offline-start-time="offlineStartTime" :submission-type="loadingContainerSubmissionType"></LoadingContainer>
</div>
<div v-else-if="isExamOver" class="h-screen flex flex-col items-center justify-center">
    <div><h1>Exam Over</h1></div>
    <div><button @click="goHome" class="px-4 py-2 bg-purple-700 font-bold text-white rounded cursor-pointer">Go Home</button></div>
</div>
<div v-else>
    <Loading :active.sync="!canViewExam" :can-cancel="true" :is-full-page="true"></Loading>
</div>


</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import { get } from '../../utility/Database/FirebaseDatabase';
import ExamWindow from '../../components/Exam/ExamWindow.vue';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import Loading from 'vue-loading-overlay'
import LoadingContainer from './LoadingContainer.vue';

const functions = getFunctions()
const isUserAdmin = httpsCallable(functions, 'isUserAdmin')
const router = useRouter()
const route = useRoute()
const contestName = ref(route.params.data)
const submissionType = ref('')
const canViewExam = ref(false)
const startTime = ref(0)
const onlineEndTime = ref(0)
const offlineStartTime = ref(0)
const offlineEndTime = ref(0)
const loadingContainerSubmissionType = ref('')
const isExamOver = ref(false)
const contestStartTime = ref(0)
const contestEndTime = ref(0)
const isAdmin = ref(false)

onBeforeMount(async () => {
    const snapshot = await isUserAdmin()
    isAdmin.value = snapshot.data
    // if user not admin, check is exam exists 
    if(snapshot.data == false){
        const examSnapshot = await get("livecontest/" + contestName.value)
        if(examSnapshot.data == null){
            await router.push('/')
            window.location.reload()
        }
    }
    if(!isAdmin.value) await setTimings()
    submissionType.value = getSubmissionType()
    console.log('submission type', submissionType.value)
    canViewExam.value = await canUserViewExam()
    
    if(canViewExam.value == true && isAdmin.value == false){
        if(submissionType.value == 'live'){
            setExamTimer(startTime.value, onlineEndTime.value)
        }
        else if(submissionType.value == 'offline')
            setExamTimer(offlineStartTime.value, offlineEndTime.value)
    }
    console.log('exam vue contest start time', contestStartTime.value)
    loadingContainerSubmissionType.value = getLoadingType()
    console.log(loadingContainerSubmissionType.value , 'loading');

    if(new Date().getTime() > offlineEndTime.value)
        isExamOver.value = true
    
})

async function handleLoadingTimerOver(){
    console.log('handle loading time over');
    const now = new Date().getTime()
    if(startTime.value <= now && now <= onlineEndTime.value){
        submissionType.value = 'live'
        canViewExam.value = true
        setExamTimer(startTime.value, onlineEndTime.value)
    }
    else if(offlineStartTime.value <= now && now <= offlineEndTime.value){
        submissionType.value = 'offline'
        canViewExam.value = true
        setExamTimer(offlineStartTime.value, offlineEndTime.value)
    }
}
async function setTimings() {
    const snapshot = await get("livecontestwindow/" + contestName.value + "/" + "examwindow/")
    const examWindow = snapshot.value
    startTime.value = examWindow.starttime
    onlineEndTime.value = examWindow.onlineendtime
    offlineEndTime.value = examWindow.offlineendtime
    offlineStartTime.value = examWindow.offlinestarttime
}
function getSubmissionType() {
    let subType = ''
    if(isAdmin.value){
        subType = 'admin'
        return subType
    }
    const ct = new Date().getTime()
    if (startTime.value <= ct && ct <= onlineEndTime.value)
        subType = 'live'
    else if (offlineStartTime.value <= ct && ct <= offlineEndTime.value)
        subType = 'offline'

    return subType
}

async function canUserViewExam(){
    const result = await isUserAdmin()
    if(result.data == true){
    return true
    }

    const subType = getSubmissionType()
    console.log('subtype', subType);
    if(subType == 'live' || subType == 'offline')
        return true
    else
        return false
}

function getLoadingType(){
    let type =''
    if(isAdmin.value)
    return type
    const now1 = new Date().getTime()
    if(now1 <= startTime.value)
        type = 'Live'
    else if(onlineEndTime.value <= now1 && now1 <= offlineStartTime.value)
        type = 'Offline'

    return type
}

async function goHome(){
    await router.push('/')
    window.location.reload()
}

function setExamTimer(startTime, endTime){
    contestStartTime.value = startTime
    contestEndTime.value = endTime
    var x = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();
        var distance;
        // Find the distance between now and the count down date
        if (now >= startTime && now <= endTime) {
            distance = endTime - now
        }
        else {
            distance = -1;
        }
        if (distance < 0) {
            clearInterval(x);
            console.log('timerOver');
            window.location.reload()
        }
    }, 1000);

}

</script>

<style scoped>

</style>