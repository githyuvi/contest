<script setup>
import MultipleCorrectFull from './MultipleCorrectFull.vue';
import SingleCorrectFull from './SingleCorrectFull.vue';
import MultipleCorrectDescriptionFull from './MultipleCorrectDescriptionFull.vue';
import SingleCorrectDescriptionFull from './SingleCorrectDescriptionFull.vue';
import Descriptive from './Descriptive.vue';
import { ref, reactive } from 'vue';
import { getFunctions, httpsCallable } from 'firebase/functions';
const functions = getFunctions()
const getContestQuestions = httpsCallable(functions, 'getContestQuestions',)

var questionObjects = []
const questionParts = reactive([])
const optionsText = ref('')
const correctAnswer = ref('')
const questionType = ref('')
const questionOrder = ref('')
const questionMarks = ref('')
const buttonText = ref('Next')
var index = -1
const downloaded = ref(false)

const mcComponent = ref(null)
const scComponent = ref(null)
const mcdComponent = ref(null)
const scdComponent = ref(null)
const desComponent = ref(null)

const mckey = ref(0)
const sckey = ref(0)
const mcdkey = ref(0)
const scdkey = ref(0)
const deskey = ref(0)

const next = () => {
    
    index++
    if(index<= -1){
        index = questionObjects.length-1
    }
    if(index >= questionObjects.length) {
        index = 0
    }
    questionType.value = questionObjects[index].questionType
    if(questionType.value != 'des'){
    questionType.value = questionObjects[index].questionType
    questionParts.value = questionObjects[index].questionParts
    optionsText.value = questionObjects[index].optionsText
    correctAnswer.value = questionObjects[index].correctAnswer
    questionOrder.value = questionObjects[index].questionOrder
    questionMarks.value = questionObjects[index].questionMarks
    }
    else {
        questionType.value = questionObjects[index].questionType
        questionParts.value = questionObjects[index].questionParts
        questionOrder.value = questionObjects[index].questionOrder
        questionMarks.value = questionObjects[index].questionMarks
    }
    if(questionType.value == 'mc')
    mckey.value++
    if(questionType.value == 'sc')
    sckey.value++
    if(questionType.value == 'mcd')
    mcdkey.value++
    if(questionType.value == 'scd') 
    scdkey.value++
    if(questionType.value == 'des')
    deskey.value++

}

const props = defineProps({
    contestName: String
})
const save = () => {
    next()
}

const previous = () => {
    index-=2
    next()
}

getContestQuestions({contestName:props.contestName, contestType:"democontest"}).then((result) => {
    questionObjects = result.data
    next()
    downloaded.value = true
})
</script>

<template>
<div v-if="downloaded">
    <div v-html="questionContent"></div>
    <div><MultipleCorrectFull :key="mckey" ref="mcComponent" v-if="questionType == 'mc'" :question-location="'q'+questionOrder" :questionOrder="questionOrder" :question="questionParts" :answers="optionsText" contestType="democontest" :contestName="contestName"></MultipleCorrectFull></div>
    <div><SingleCorrectFull :key="sckey" ref="scComponent" v-if="questionType == 'sc'" :question-location="'q' + questionOrder" :questionOrder="questionOrder" :question="questionParts" :answers="optionsText" contestType="democontest" :contestName="contestName"></SingleCorrectFull></div>
    <div><MultipleCorrectDescriptionFull :key="mcdkey" ref="mcdComponent" v-if="questionType == 'mcd'" :question-location="'q'+questionOrder" :questionOrder="questionOrder" :question="questionParts" :answers="optionsText" contestType="democontest" :contestName="contestName"></MultipleCorrectDescriptionFull></div>
    <div><SingleCorrectDescriptionFull :key="scdkey" ref="scdComponent" v-if="questionType == 'scd'" :question-location="'q' + questionOrder" :questionOrder="questionOrder" :question="questionParts" :answers="optionsText" contestType="democontest" :contestName="contestName"></SingleCorrectDescriptionFull></div>
    <div><Descriptive :key="deskey" ref="desComponent" v-if="questionType == 'des'" :question-location="'q' + questionOrder" :question-order="questionOrder" :question="questionParts" contest-type="livecontest" :contest-name="contestName"></Descriptive></div>
    <div style="" ><button @click="save">{{ buttonText }}</button></div>
    <div style="" ><button @click="previous">Previous</button></div>
</div>
<!-- </div> -->
</template>