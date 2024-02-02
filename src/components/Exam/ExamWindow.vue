<template>
    <div class="mb-20">
        <ExamMainArea :contest-name="contestName" @change-question="handleQuestionChange"
            :contest-start-time="props.contestStartTime" :contest-end-time="props.contestEndTime"
            ref="examMainAreaComponent" :key="examMainAreaKey" v-if="questionsDownloaded" :questions-array="questionsArray"
            @on-user-response-change="handleUserResponseChange" :index="index" :clear-submission="clearSubmission">
        </ExamMainArea>
    </div>
    <div style="margin: 0 auto;">
        <div class="button-container" v-if="questionsDownloaded">
            <button @click="previous"><i class="fas fa-chevron-left"></i></button>
            <button @click="next"><i class="fas fa-chevron-right"></i></button>
            <button v-if="props.contestType != 'archivedcontest'" class="clear" @click="clear">Clear</button>
            <button v-if="props.contestType != 'archivedcontest'" @click="() => handleOnSave(index)">Save & Next</button>
        </div>
        <ExamInstructionsModal v-if="examInstructionsVisible"
            @close-instruction-modal="() => examInstructionsVisible = false"></ExamInstructionsModal>
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
const firstdes = ref(0)

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

        // Use Promise.all to process all questions concurrently
        const processedQuestions = await Promise.all(questions.map(processQuestion));

        // Now processedQuestions contains the results of all asynchronous operations
        questionsArray.value.push(...processedQuestions);

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
        await saveDes(props.submissionType, props.contestName, userId.value, 'q' + questionsArray.value[index].questionNumber, userResponse.value, firstdes.value).then(value => {
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



// Define a function to process each question
const processQuestion = async (question) => {
    const questionNumber = question.questionOrder;
    const questionType = question.questionType;
    const questionMarks = question.questionMarks;

    // Convert question Data and options data into displayable data
    const questionParts = await getQuestionData('livecontest', props.contestName, userId.value, question.questionParts);
    let optionsArray = null;
    let submissions = null;

    // Options for sc and mc
    if (questionType === 'sc' || questionType === 'mc') {
        optionsArray = await Promise.all(question.optionsArray.map(async (option, j) => {
            const optionParts = await getQuestionData('livecontest', props.contestName, userId.value, option);
            return {
                id: j + 1,
                index: j,
                optionParts: optionParts,
            };
        }));
    }

    // Check for existing user submissions
    const submissionSnapshot = await get(`${props.submissionType}contestsubmission/${props.contestName}/${userId.value}/answers/q${questionNumber}`);
    if (submissionSnapshot.status === 'success' && submissionSnapshot.value === null) {
        submissions = null;
    } else {
        submissions = submissionSnapshot.value;
    }

    console.log('submissions', submissions);

    if (question.questionType === 'des') {
        if (firstdes.value === 0) {
            firstdes.value = questionNumber;
        }

        if (submissions !== null && submissions.images !== null) {
            submissions = await convertImageNamesToImageFiles(submissions.images);
        }
    }

    return {
        questionNumber,
        questionType,
        questionMarks,
        questionParts,
        optionsArray,
        submissions,
    };
};



</script>

<style scoped>
@import '../../assets/buttons.css';
@import '../../assets/modals.css';
</style>