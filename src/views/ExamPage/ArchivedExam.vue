<template>
      <div>
    <!-- Toggle button -->
    <button v-if="canViewExam" @click="toggleSubmissionType" class="fixed top-1 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md z-50">
      {{ submissionType === 'live' ? 'Switch to Offline' : 'Switch to Live' }}
    </button>

    <!-- Conditional rendering based on canViewExam -->
    <div v-if="canViewExam">
      <ExamWindow :contest-start-time="contestStartTime" :contest-end-time="contestEndTime" :contest-name="contestName"
        :contest-type="'archivedcontest'" :submission-type="submissionType"></ExamWindow>
    </div>
    <div v-else>
      <Loading :active.sync="!canViewExam" :can-cancel="true" :is-full-page="true"></Loading>
    </div>
  </div>
</template>
    
<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onBeforeMount, computed } from 'vue';
import ExamWindow from '../../components/Exam/ExamWindow.vue';
import Loading from 'vue-loading-overlay'
import { useStore } from 'vuex';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

const store = useStore()
const functions = getFunctions()
const router = useRouter()
const isUserAdmin = httpsCallable(functions, 'isUserAdmin')
const checkContestAccess = httpsCallable(functions, 'checkContestAccess')
const route = useRoute()
const contestName = ref(route.params.data)
const canViewExam = ref(false)
const contestStartTime = ref(0)
const contestEndTime = ref(0)
const userEmail = computed(() => store.state.userEmail)
const submissionType = ref('live')

async function canUserViewExam(){
    const result = await isUserAdmin()
    if(result.data == true){
    return true
    }
    const checkContestAccessResult = await checkContestAccess({contestName: contestName.value, userEmail: userEmail.value})
    
    if(!checkContestAccessResult.data){
        alert('Ask your teacher to give you access to this exam')
        await router.push('/')
        window.location.reload()
    }
    if(checkContestAccessResult.data) return true
    
}

const toggleSubmissionType = async () => {
  submissionType.value = submissionType.value === 'live' ? 'offline' : 'live';
  // You may want to fetch data or perform actions based on the new submissionType here
  await router.push({
    replace: true,
    query: {
      subtype: submissionType.value === 'live' ? 'live' : 'offline'
    },
    hash: route.hash,
  })
  window.location.reload()
};

onBeforeMount(async () => {
    if(route.query.subtype == 'offline') submissionType.value = 'offline'
    canViewExam.value = await canUserViewExam()
})

</script>
    
<style scoped></style>