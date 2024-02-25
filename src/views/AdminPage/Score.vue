<template>
    <div>
        <div class="p-4">
            <!-- Toggle Submission Type Section -->
            <div class="mb-4">
                <button @click="toggleSubmissionType" class="bg-blue-500 text-white py-2 px-4 rounded">
                    Go to {{ changeToSubmissionType }}
                </button>
            </div>

            <!-- Get User Input for Contest Name Section -->
            <div class="mb-4">
                <input type="text" v-model="contestName" class="border p-2 border-black mr-2">
                <button @click="updateAndFetchScores" class="bg-green-500 text-white py-2 px-4 rounded mr-1">
                    Update and Fetch {{ changeToSubmissionType === 'live' ? 'offline' : 'live' }} scores
                </button>
            </div>

            <!-- Show Submissions Section -->
            <div>
                <!-- Show Live Submissions Score -->
                <div v-if="changeToSubmissionType === 'offline'" class="bg-gray-200 p-4 rounded">
                    Live Submissions
                </div>

                <!-- Show Offline Submissions Score -->
                <div v-else class="bg-gray-200 p-4 rounded">
                    Offline Submissions
                </div>
            </div>
            <div>
                <div v-for="(score, index) in scores" :key="index" class="mb-4">
                    <p class="text-xl">
                        {{ score.email }}, Part A - {{ score.totalObjective.value }} out of 40,
                        <button @click="displayImage(index)">PartA.jpg</button>
                    </p>
                    <!-- Display dynamically generated image -->
                    <TextToImage v-if="displayedImageIndex === index" :text="score.studentResponse" :key="score.email">
                    </TextToImage>
                </div>
            </div>


        </div>

        <div class="flex items-center justify-center h-screen">
            <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { getFunctions, httpsCallable } from 'firebase/functions';
import TextToImage from '../../components/TextToImage.vue';
import Loading from 'vue-loading-overlay'
import axios from 'axios';

//till 15
const numberToCharacter = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
    10: 'J',
    11: 'K',
    12: 'L',
    13: 'M',
    14: 'N',
    15: 'O',
}

const functions = getFunctions()
const updateScore = httpsCallable(functions, 'updateScore')
const changeToSubmissionType = ref('offline')
const scores = ref([])
const userIds = ref([])
const contestName = ref('')
const isLoading = ref(false)
const BASE_URL = 'https://vueexam-15ff4-default-rtdb.firebaseio.com'
const AUTH = 'auth=tvkUOXCOI0Ol1BhiFEsD5CZjnofCTcuLXIvqquVl'
const userEmailByUid = ref({})
const examSubmissions = ref([])
const displayedImageIndex = ref(null);

const displayImage = (index) => {
    if(displayedImageIndex.value === index) {
        displayedImageIndex.value = null;
        return;
    }
    displayedImageIndex.value = index;
};

function toggleSubmissionType() {
    if (changeToSubmissionType.value == 'live') {
        changeToSubmissionType.value = 'offline'
        scores.value = []

    }
    else {
        changeToSubmissionType.value = 'live'
        scores.value = []
    }
}

async function updateAndFetchScores() {
    isLoading.value = true
    userIds.value = []
    const subType = changeToSubmissionType.value == 'live' ? 'offline' : 'live'
    console.log('subtype', subType)
    const snapshot = await axios.get(`${BASE_URL}/${subType}contestsubmission/${contestName.value}.json?${AUTH}`)
    const submissions = snapshot.data
    examSubmissions.value = submissions
    for (let userId in submissions) {
        userIds.value.push(userId)
    }
    console.log('userIds', userIds.value)
    const updateScorePromises = []

    for (let i = 0; i < userIds.value.length; i++) {
        const userId = userIds.value[i]

        // Push the promise returned by updateScore to the array
        updateScorePromises.push(updateScore({ contestName: contestName.value, userId, submissionType: subType }))
    }

    // Use Promise.all to wait for all promises to be resolved
    Promise.all(updateScorePromises)
        .then(async scores => {
            await fetchScores()
            isLoading.value = false
        })
        .catch(error => {
            // Handle errors here
            console.error('Error updating scores:', error)
            isLoading.value = false
        });

}

async function fetchScores() {
    scores.value = []
    if (examSubmissions.value.length == 0) await fetchSubmissions()
    const subType = changeToSubmissionType.value == 'live' ? 'offline' : 'live'
    const snapshot = await axios.get(`${BASE_URL}/${subType}scores/${contestName.value}.json?${AUTH}`)
    const scoresData = snapshot.data
    for (let userId in scoresData) {
        let objective = scoresData[userId].scores.objective
        //remove first value in objective array
        objective.shift()
        let totalObjective = scoresData[userId].scores.totalObjective
        let email = userEmailByUid.value[userId]
        let studentResponse = 'Part A\n' + '========\n\n\n'
        for (let j = 0; j < objective.length; j++) {
            let qNum = j + 1
            let studentAnswer = ''
            if (examSubmissions.value[userId].answers[`q${qNum}`] && examSubmissions.value[userId].answers[`q${qNum}`].options && examSubmissions.value[userId].answers[`q${qNum}`].options.length > 1) {
                for(let i = 0;i< examSubmissions.value[userId].answers[`q${qNum}`].options.length;i++){
                    if(i == examSubmissions.value[userId].answers[`q${qNum}`].options.length-1){
                        studentAnswer += numberToCharacter[examSubmissions.value[userId].answers[`q${qNum}`].options[i]]
                    }
                    else{
                        studentAnswer += numberToCharacter[examSubmissions.value[userId].answers[`q${qNum}`].options[i]] + ', '
                    }
                }  
            }
            else if (examSubmissions.value[userId].answers[`q${qNum}`] && examSubmissions.value[userId].answers[`q${qNum}`].options && examSubmissions.value[userId].answers[`q${qNum}`].options) {
                studentAnswer = numberToCharacter[examSubmissions.value[userId].answers[`q${qNum}`].options]
            }
            if(examSubmissions.value[userId].answers[`q${qNum}`] && examSubmissions.value[userId].answers[`q${qNum}`].answer){
                studentAnswer = examSubmissions.value[userId].answers[`q${qNum}`].answer
            }
            studentResponse += `Q${qNum}. ${studentAnswer}\n`
        }
        scores.value.push({
            userId,
            email,
            objective,
            totalObjective,
            studentResponse
        })
    }
    console.log('scores', scores.value)
}

async function fetchUserEmailByUid() {
    const snapshot = await axios.get(`${BASE_URL}/users.json?${AUTH}`)
    const users = snapshot.data
    for (let uid in users) {
        userEmailByUid.value[uid] = users[uid].email
    }
}

const replaceLineBreaks = (text) => {
    return text.replace(/\n/g, '<br>');
};

async function fetchSubmissions() {
    const subType = changeToSubmissionType.value == 'live' ? 'offline' : 'live'
    console.log('subtype', subType)
    const snapshot = await axios.get(`${BASE_URL}/${subType}contestsubmission/${contestName.value}.json?${AUTH}`)
    const submissions = snapshot.data
    examSubmissions.value = submissions

}

onBeforeMount(async () => {
    await fetchUserEmailByUid()
})



</script>

<style scoped></style>