<template>
    <div class="mb-20">
        <ExamMainArea @change-question="handleQuestionChange" :contest-start-time="props.contestStartTime"
            :contest-end-time="props.contestEndTime" ref="examMainAreaComponent" :key="examMainAreaKey"
            v-if="questionsDownloaded" :questions-array="questionsArray"
            @on-user-response-change="handleUserResponseChange" :index="index" :clear-submission="clearSubmission">
        </ExamMainArea>
    </div>
    <div style="margin: 0 auto;">
    <div class="button-container" v-if="questionsDownloaded">
        <button @click="previous"><i class="fas fa-chevron-left"></i></button>
        <button @click="next"><i class="fas fa-chevron-right"></i></button>
        <button v-if="props.submissionType != 'archived'" class="clear" @click="clear">Clear</button>
        <button v-if="props.submissionType != 'archived'" @click="() => handleOnSave(index)">Save & Next</button>
    </div>
    <ExamInstructionsModal v-if="examInstructionsVisible" @close-instruction-modal="() => examInstructionsVisible = false"></ExamInstructionsModal>
</div>
    <div>
        <Loading :active.sync="!questionsDownloaded" :can-cancel="true" :is-full-page="true"></Loading>
    </div>
</template>

<script setup>
import { computed, ref, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getQuestionData } from '../../utility/getContentData'
import { get } from '../../utility/Database/FirebaseDatabase';
import { getDownloadURL, ref as firebaseStorageRef, getStorage } from 'firebase/storage';
import { saveScMc, saveNum, saveDes } from '../../utility/SaveUserResponseOnline/SaveUserResponseOnlineFirebase'
import ExamMainArea from './ExamMainArea.vue';
import Loading from 'vue-loading-overlay';
import ExamInstructionsModal from './ExamInstructionsModal.vue';
const clearSubmission = ref(false)
const examMainAreaComponent = ref(null)

const functions = getFunctions()
const storage = getStorage()
const getContestQuestions = httpsCallable(functions, 'getContestQuestions')
const store = useStore()
const questionsArray = ref([])
const userId = computed(() => store.state.userId)
const userResponse = ref(null)
const questionsDownloaded = ref(false)
const index = ref(-1)
const examMainAreaKey = ref(0)
const props = defineProps({
    contestName: String,
    submissionType: String,
    contestType: String,
    contestStartTime: Number,
    contestEndTime: Number
})
const examInstructionsVisible = ref(true)

onBeforeMount(async () => {
    //fetch all the questions
    await getContestQuestions({ contestName: props.contestName, contestType: props.contestType }).then(async (result) => {
        const questions = result.data
        console.log('all questions fetched');
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i]
            let questionNumber = question.questionOrder
            let questionType = question.questionType
            let questionMarks = question.questionMarks

            //convert question Data and options data into displayable data
            let questionParts = await getQuestionData('livecontest', props.contestName, userId.value, question.questionParts)
            let optionsArray = null
            let submissions = null

            //options for sc and mc
            if (questionType == 'sc' || questionType == 'mc') {
                optionsArray = []
                for (let j = 0; j < question.optionsArray.length; j++) {
                    let optionParts = await getQuestionData('livecontest', 'mock', userId.value, question.optionsArray[j])
                    optionsArray.push({
                        id: j + 1,
                        index: j,
                        "optionParts": optionParts
                    })

                }
            }

            //check for existing user submissions
            let submissionSnapshot = await get(`${props.submissionType}contestsubmission/${props.contestName}/${userId.value}/answers/q${questionNumber}`)
            submissions = submissionSnapshot.value

            if (question.questionType == 'des') {
                if (submissions != null && submissions.images != null) {
                    submissions = await convertImageNamesToImageFiles(submissions.images)
                }
            }

            questionsArray.value.push({
                questionNumber,
                questionType,
                questionMarks,
                questionParts,
                optionsArray,
                submissions
            })
        }

    })
    index.value = 0
    userResponse.value = getUserResponse(index.value)
    questionsDownloaded.value = true
})

async function convertImageNamesToImageFiles(imagePaths) {
    let files = []
    for (let i = 0; i < imagePaths.length; i++) {
        const url = await getDownloadURL(firebaseStorageRef(storage, imagePaths[i]),);
        const response = await fetch(url); // Fetch the image from the URL
        const blob = await response.blob(); // Convert the fetched data into a Blob

        // Create a File object
        const file = new File([blob], `image${Math.floor(Math.random() * 100).toString()}`, { type: blob.type });

        files.push(file)
    }
    return files
}

function handleUserResponseChange(userRes) {
    userResponse.value = userRes
    console.log(userResponse.value)
}

async function handleOnSave(index) {
    questionsDownloaded.value = false
    if (questionsArray.value[index].questionType == 'sc' || questionsArray.value[index].questionType == 'mc') {
        await saveScMc(props.submissionType, props.contestName, userId.value, 'q' + questionsArray.value[index].questionNumber, userResponse.value).then(value => {
            if (!questionsArray.value[index].submissions) {
                questionsArray.value[index].submissions = {};
            }
            questionsArray.value[index].submissions["options"] = userResponse.value;
            if (userResponse.value == null)
                questionsArray.value[index].submissions = null
        })
    }
    if (questionsArray.value[index].questionType == 'num') {
        await saveNum(props.submissionType, props.contestName, userId.value, 'q' + questionsArray.value[index].questionNumber, userResponse.value).then(value => {
            if (!questionsArray.value[index].submissions) {
                questionsArray.value[index].submissions = {};
            }
            questionsArray.value[index].submissions["answer"] = userResponse.value;
            if (userResponse.value == null)
                questionsArray.value[index].submissions = null
        })
    }
    if (questionsArray.value[index].questionType == 'des') {
        if (userResponse.value == null) userResponse.value = []
        await saveDes(props.submissionType, props.contestName, userId.value, 'q' + questionsArray.value[index].questionNumber, userResponse.value).then(value => {
            // if (!questionsArray.value[index].submissions) {
            // questionsArray.value[index].submissions = {};
            // }
            questionsArray.value[index].submissions = userResponse.value;
        })
    }
    questionsDownloaded.value = true
    next()
}

function previous() {
    if (index.value > 0) {
        index.value--
        userResponse.value = getUserResponse(index.value)
        examMainAreaKey.value++
    }
}

function next() {
    // console.log(questionsArray);
    if (index.value < questionsArray.value.length - 1) {
        index.value++
        userResponse.value = getUserResponse(index.value)
        examMainAreaKey.value++
    }
    console.log(index.value);
}

function handleQuestionChange(i) {
    index.value = i - 1
    next()
}

function clear() {
    userResponse.value = null
    examMainAreaComponent.value.clear()
}

function getUserResponse(index) {
    if (questionsArray.value[index].questionType == 'sc' || questionsArray.value[index].questionType == 'mc') {
        if (questionsArray.value[index].submissions != null)
            return questionsArray.value[index].submissions.options
        else
            return null
    }
    else if (questionsArray.value[index].questionType == 'num') {
        if (questionsArray.value[index].submissions != null)
            return questionsArray.value[index].submissions.answer
        else
            return null
    }
    else if (questionsArray.value[index].questionType == 'des') {
        if (questionsArray.value[index].submissions != null)
            return questionsArray.value[index].submissions
        else
            return []
    }

}

</script>

<style scoped>
@import '../../assets/buttons.css';
@import '../../assets/modals.css';
</style>