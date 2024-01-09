<script setup>
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { onMounted, reactive, ref } from 'vue';
import Loading from 'vue-loading-overlay';
import ImageFirebase from './ImageFirebase.vue'

const functions = getFunctions()
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

const getAllScores = httpsCallable(functions, 'getAllScores')
const getContestQuestions = httpsCallable(functions, 'getContestQuestions')
const getImages = httpsCallable(functions, 'getImages')
const props = defineProps({
    contestName: String
})

const objectiveQuestions = reactive([])
const subjectiveQuestions = reactive([])
const images = reactive([])
//clear images

const downloaded = ref(false)

const isLoading = ref(false)
const fullPage = ref(true)


const userScores = reactive({})
const imgComponent = ref(null)

//generate random string
function getRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var i;
    for (i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// take an array and convert it into object
function arrayToObject(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; ++i)
        if (arr[i] != null)
            obj[i] = arr[i];
    return obj;
}

const parseScore = (score) => {

    if (score == null) return "U"
    if (score == "not submitted")
        return "NS"
    if (score == "not evaluated")
        return "NE"
    return score
}

onMounted(async () => {
    isLoading.value = true
    await getAllScores({ contestName: props.contestName }).then((result) => {
        for (let userId in result.data) {
            userScores[userId] = result.data[userId]
        }
    })

    await getContestQuestions({ contestName: props.contestName, contestType: 'livecontest' }).then((result) => {
        const questions = result.data
        for (let i = 0; i < questions.length; i++) {
            let question = questions[i]
            if (question.questionType == 'des') {
                subjectiveQuestions.push(i + 1)
            }
            else {
                objectiveQuestions.push(i + 1)
            }
        }

    })

    downloaded.value = true
    isLoading.value = false

})

const handleSubjectiveClick = async (studentId, qN) => {
    //clear images
    try {
        console.time('codeExecution');
        isLoading.value = true
        images.splice(0, images.length)
        const imageData = await getImages({
            contestName: props.contestName,
            questionNumber: qN,
            studentId: studentId
        })
        console.log(imageData.data)
        if (imageData.data != null) {
            for (let i = 0; i < imageData.data.length; i++) {
                images.push(imageData.data[i])
            }
            await imgComponent.value.fetchImageUrls()
        }
        isLoading.value = false
        console.timeEnd('codeExecution');
    }
    catch (e) {
        console.log(e)
        isLoading.value = false
    }
}



</script>
<template v-cloak>
    <div v-if="downloaded">
        <div class="table">
            <div class="row header blue">
                <div class="cell">
                    #
                </div>
                <div class="cell">
                    Name
                </div>
                <div class="cell">
                    O
                </div>
                <div class="cell">
                    S
                </div>
                <div class="cell">
                    Total
                </div>
            </div>

            <div class="row">
                <div class="cell">

                </div>
                <div class="cell">

                </div>
                <div class="cell">
                    <div class="cellWithin" v-for="qN, index in objectiveQuestions" :key="index">
                        {{ qN }}
                    </div>
                </div>
                <div class="cell">
                    <div class="cellWithin" v-for="qN, index in subjectiveQuestions" :key="index">
                        {{ qN }}
                    </div>
                </div>
                <div class="cell">
                    Total
                </div>
            </div>
            <div class="row" v-for="userScores, userId, userIndex in userScores" :key="userIndex">
                <div class="cell">
                    {{ userIndex + 1 }}

                </div>
                <div class="cell">
                    {{ getRandomString(5) }}
                </div>
                <div class="cell">
                    <div class="cellWithin" v-for="scr, index in arrayToObject(userScores['scores']['objective'])"
                        :key="index">
                        {{ parseScore(scr) }}
                    </div>
                </div>
                <div class="cell">
                    <div @click="(e) => handleSubjectiveClick(userId, index)" class="cellWithin"
                        v-for="scr, index in userScores['scores']['subjective']" :key="index">
                        {{ parseScore(scr) }}
                    </div>
                </div>

            </div>

        </div>

        <div>
            <h1>answers</h1>
            <image-firebase ref="imgComponent" :image="images"></image-firebase>
        </div>

    </div>
    <div class="vld-parent">
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    </div>
</template>

<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';
@import '../assets/tables.css';

[v-cloak] {
    display: none;
}</style>