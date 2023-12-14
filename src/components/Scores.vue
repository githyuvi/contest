<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import Loading from 'vue-loading-overlay';
import { useStore } from "vuex";
import {
  getDatabase,
  ref as firebaseRef,
  set,
  get,
  child,
  
} from "firebase/database";
import { getFunctions, httpsCallable } from 'firebase/functions';
const functions = getFunctions()
const getContestQuestions = httpsCallable(functions, 'getContestQuestions',)

const store = useStore();
const db = getDatabase();
const dbRef = firebaseRef(db);
const downloaded = ref(false)
const totalScore = ref(0)

const userId = computed(() => store.state.userId)
var questionObjects = []
let correctAnswers = {}
// let scores = {}
let scores = reactive({})
let userResponse = {}
const isLoading = ref(false)
const fullPage = ref(true)

const props = defineProps({
    contestName: String
})
const getCorrectAnswers = async()=>{
    await getContestQuestions({contestName:props.contestName, contestType:"livecontest"}).then((result) => {
    let index = 0;
    questionObjects = result.data
    questionObjects.forEach(question => {
    correctAnswers[++index] = question.correctAnswer;
    });
    console.log(correctAnswers)

    
})
}
const getSubmission = async()=> {
  for(let i = 0;i<questionObjects.length;i++){
    let questionNumber = i+1
    await get(child(dbRef,"livecontestsubmission/" + props.contestName + "/" + userId.value + "/" +  `answers/q` + questionNumber + "/options"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        
        const userAnswers = snapshot.val();
        userResponse[questionNumber] = userAnswers
      }
      
    })
    .catch((error) => {
      console.log(error);
      alert("couldn't fetch results");
    });
    
  }
  downloaded.value = true
  isLoading.value = false
    
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const arr1Set = new Set(arr1);
  const arr2Set = new Set(arr2);

  for (const item of arr2Set) {
    if (!arr1Set.has(item) || arr2Set.size !== arr1Set.size) {
      return false;
    }
  }

  return true;
}

const computeScore = ()=>{

    // Loop through userResponse keys (question numbers)
    for (const questionNumber in userResponse) {
        const userAnswer = userResponse[questionNumber];
        const correctAnswer = correctAnswers[questionNumber];
        let questionType = questionObjects[questionNumber - 1].questionType
        // Check if the user response matches the correct answer
        if (questionType == 'mc' || questionType == 'mcd') {
            // If the user response is an array (for multiple choice), check every element
            if (arraysEqual(userAnswer, correctAnswer)) {
                scores[questionNumber] = questionObjects[questionNumber - 1].questionMarks
                totalScore.value += parseInt(questionObjects[questionNumber - 1].questionMarks)
            }
            else {
              scores[questionNumber] = 0
            }
        } else {
            // If the user response is a string (for single choice), compare directly
            if (userAnswer === correctAnswer[0]) {
              scores[questionNumber] = questionObjects[questionNumber - 1].questionMarks
              totalScore.value += parseInt(questionObjects[questionNumber - 1].questionMarks)
            }
            else {
              scores[questionNumber] = 0
            }
        }
    }
}
isLoading.value = true
getCorrectAnswers().then((value) => {
  getSubmission().then((value) => {
    console.log('before computescore')
    computeScore()
    console.log('scores' , scores)
   }).catch(() => {
  });
 }).catch(() => {
});



</script>

<template>

<div v-if="downloaded"> 
    <div>Scores</div>
    <div v-for="(scr,qn) in scores" :key="qn">
      <p> 
        Question Number {{ qn }}
      </p>
      <p>
        Correct Answer {{ correctAnswers[qn] }}
      </p>
      <p>
        Your Response {{ userResponse[qn] }}
      </p>
      <p>
        Score: {{ scr }}
      </p>
      <br>
    </div>

    <div>
      Total Score: {{ totalScore }}
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