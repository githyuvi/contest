<template>
    <div v-if="canViewExam">
        <ExamWindow :contest-start-time="contestStartTime" :contest-end-time="contestEndTime" :contest-name="contestName"
            :contest-type="'archivedcontest'" :submission-type="'archived'"></ExamWindow>
    </div>
    <div v-else>
        <Loading :active.sync="!canViewExam" :can-cancel="true" :is-full-page="true"></Loading>
    </div>
</template>
    
<script setup>
import { useRoute } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import ExamWindow from '../../components/Exam/ExamWindow.vue';
import Loading from 'vue-loading-overlay'

const route = useRoute()
const contestName = ref(route.params.data)
const canViewExam = ref(false)
const contestStartTime = ref(0)
const contestEndTime = ref(0)

onBeforeMount(async () => {
    canViewExam.value = true
})

</script>
    
<style scoped></style>