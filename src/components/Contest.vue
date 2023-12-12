<script setup>
import MultipleCorrectFull from './MultipleCorrectFull.vue';
import SingleCorrectFull from './SingleCorrectFull.vue';
import MultipleCorrectDescriptionFull from './MultipleCorrectDescriptionFull.vue';
import SingleCorrectDescriptionFull from './SingleCorrectDescriptionFull.vue';
import Descriptive from './Descriptive.vue';
import { ref, reactive } from 'vue';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Loading from 'vue-loading-overlay';
const functions = getFunctions()
const getContestQuestions = httpsCallable(functions, 'getContestQuestions',)

var questionObjects = []
const questionParts = reactive([])
const optionsText = ref('')
const correctAnswer = ref('')
const questionType = ref('')
const questionOrder = ref('')
const questionMarks = ref('')
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

const isLoading = ref(false)
const fullPage = ref(true)

const next = () => {
    
    index++
    console.log(index)
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
const save = async() => {
    isLoading.value = true
    if(questionType.value == 'mc') {
        await mcComponent.value.save()
        
    } else if(questionType.value == 'sc') {
        console.log('scComponent', scComponent.value)
        await scComponent.value.save()

    } else if(questionType.value == 'mcd') {
        console.log(mcdComponent)
        await mcdComponent.value.save()

    } else if(questionType.value == 'scd') {
        await scdComponent.value.save()

    } else if(questionType.value == 'des'){
        await desComponent.value.save()
    
    }
    
    next()
    isLoading.value = false
}

const previous = () => {
    index-=2
    next()
}
isLoading.value = true
getContestQuestions({contestName:props.contestName, contestType:"livecontest"}).then((result) => {
    
    questionObjects = result.data
    console.log(questionObjects)
    next()
    downloaded.value = true
    isLoading.value = false
})

</script>

<template v-cloak>
<div v-if="downloaded"> 
    <div><MultipleCorrectFull :key="mckey" ref="mcComponent" v-if="questionType == 'mc'" :question-location="'q'+questionOrder" :question-order="questionOrder" :question="questionParts" :answers="optionsText" contest-type="livecontest" :contest-name="contestName"></MultipleCorrectFull></div>
    <div><SingleCorrectFull :key="sckey" ref="scComponent" v-if="questionType == 'sc'" :question-location="'q' + questionOrder" :question-order="questionOrder" :question="questionParts" :answers="optionsText" contest-type="livecontest" :contest-name="contestName"></SingleCorrectFull></div>
    <div><MultipleCorrectDescriptionFull :key="mcdkey" ref="mcdComponent" v-if="questionType == 'mcd'" :question-location="'q'+questionOrder" :questionOrder="questionOrder" :question="questionParts" :answers="optionsText" contestType="livecontest" :contestName="contestName"></MultipleCorrectDescriptionFull></div>
    <div><SingleCorrectDescriptionFull :key="mcdkey" ref="scdComponent" v-if="questionType == 'scd'" :question-location="'q' + questionOrder" :questionOrder="questionOrder" :question="questionParts" :answers="optionsText" contestType="livecontest" :contestName="contestName"></SingleCorrectDescriptionFull></div>
    <div><Descriptive :key="deskey" ref="desComponent" v-if="questionType == 'des'" :question-location="'q' + questionOrder" :question-order="questionOrder" :question="questionParts" contest-type="livecontest" :contest-name="contestName"></Descriptive></div>
<div class="button-container">
    <button @click="save">Save and Next</button>
    <button @click="next">Next</button>
    <button @click="previous">Previous</button>
</div>
</div>
<div class="vld-parent">
  <Loading :active.sync="isLoading" 
  :can-cancel="true" 
  :is-full-page="fullPage"></Loading>

</div>
</template>


<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';

[v-cloak] {
  display: none;
}

.button-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      padding: 10px;
    }

.button-container button {
    margin: 0 5px;
}
</style>