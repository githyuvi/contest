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
const getContestQuestions = httpsCallable(functions, 'getContestQuestions')

const store = useStore();
const db = getDatabase();
const dbRef = firebaseRef(db);
const downloaded = ref(false)
const totalScoreObjective = ref(0)
const totalScoreSubjective = ref(0)

const userId = computed(() => store.state.userId)
var questionObjects = []
let correctAnswers = reactive({})
// let scores = {}
let scores = reactive({})
let userResponse = reactive({})
const isLoading = ref(false)
const fullPage = ref(true)

const props = defineProps({
  contestName: String
})



onMounted(async () => {
  isLoading.value = true
  //fetch scores from database
  await get(child(dbRef, `scores/${props.contestName}/${userId.value}/scores`)).then(async (snapshot) => {
    if (snapshot.exists()) {
      scores = snapshot.val()
      totalScoreObjective.value = 0
      totalScoreSubjective.value = 0
      for (let i = 0; i < scores["objective"]; i++) {
        if (scores["objective"][i] == null) continue
        totalScoreObjective.value += scores["objective"][i]
      }
      for (let i = 0; i < scores["subjective"]; i++) {
        if (scores["subjective"][i] == null) continue
        totalScoreSubjective.value += scores["subjective"][i]
      }

      
    }
  }).catch((error) => {
    console.error(error);
  });
  await get(child(dbRef, `livecontestsubmission/${props.contestName}/${userId.value}/answers`)).then((value) => {
    if (value.exists()) {
      userResponse = value.val()
    }

  })
  await getContestQuestions({ contestName: props.contestName, contestType: 'livecontest' }).then((result) => {
    let questions = result.data
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i]
      if (question.questionType == 'num') {
        correctAnswers[i+1] = [question.correctAnswerLower, question.correctAnswerUpper]
        continue
      }
      if (question.correctAnswer == null) continue
      correctAnswers[i + 1] = question.correctAnswer

    }
  })
  downloaded.value = true
  isLoading.value = false

})
function getValue(ur){
  if(ur == null)
  return null
  if(ur["options"] != null){
    console.log(ur["options"].length)
    if(ur["options"].length == 1)
    return ur["options"]
    else {
      let str = ""
      for(let i = 0;i<ur["options"].length;i++){
        str += ur["options"][i]
        if(i != ur["options"].length - 1){
          str += ", "
        }
      }
      return str
    
    }
}
if(ur["answer"] != null){
  return ur["answer"]
}
  
  return ur["images"]
}

function destructureCorrectAnswers(correctAnswerArray){
  let str = ""
  for(let i = 0;i<correctAnswerArray.length;i++){
    str += correctAnswerArray[i]
    if(i != correctAnswerArray.length - 1){
      str += ", "
    }
  }
  return str

}
</script>

<template>
  <div v-if="downloaded">
    <div>Scores</div>
    <div class="table">

      <div class="row header blue">
        <div class="cell">
          Question
        </div>
        <div class="cell">
          Your Response
        </div>
        <div class="cell">
          Correct Answer
        </div>
        <div class="cell">
          Score
        </div>
      </div>
      <div class="row">
        <div class="cell">
          Objective
        </div>
      </div>
      <div v-for="(scr, qn) in scores['objective']" :key="qn" class="row">
        
          <div v-if="scr != null" class="cell" data-title="Question">
            {{ qn }}
          </div>
          <div v-if="scr != null" class="cell" data-title="Your Response">
            {{ getValue(userResponse['q' + qn]) }}
          </div>
          <div v-if="scr != null" class="cell" data-title="Correct Answer">
            {{ destructureCorrectAnswers(correctAnswers[qn]) }}
          </div>
          <div v-if="scr != null" class="cell" data-title="Score">
            {{ scr }}
          </div>
        

      </div>
      <div class="row">
        <div class="cell">
          Subjective
        </div>
      </div>
      <div v-for="(scr, qn) in scores['subjective']" :key="qn" class="row">
        <!-- <div v-if="scr != null"> -->
          <div v-if="scr != null" class="cell" data-title="Question">
            {{ qn }}
          </div>
          <div v-if="scr != null" class="cell" data-title="Your Response">
            {{ getValue(userResponse['q' + qn]) }}
          </div>
          <div v-if="scr != null" class="cell" data-title="Correct Answer">
            {{ correctAnswers[qn] }}
          </div>
          <div v-if="scr != null" class="cell" data-title="Score">
            {{ scr }}
          </div>
        <!-- </div> -->

      </div>



    </div>
  </div>
  <div class="vld-parent">
    <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>

  </div>
</template>


<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';

[v-cloak] {
  display: none;
}



@media screen and (max-width: 580px) {
  body {
    font-size: 16px;
    line-height: 22px;
  }
}

.wrapper {
  margin: 0 auto;
  padding: 40px;
  max-width: 800px;
}

.table {
  margin: 0 0 40px 0;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  display: table;
}

@media screen and (max-width: 580px) {
  .table {
    display: block;
  }
}

.row {
  display: table-row;
  background: #f6f6f6;
}

.row:nth-of-type(odd) {
  background: #e9e9e9;
}

.row.header {
  font-weight: 900;
  color: #ffffff;
  background: #ea6153;
}

.row.green {
  background: #27ae60;
}

.row.blue {
  background: #2980b9;
}

@media screen and (max-width: 580px) {
  .row {
    padding: 14px 0 7px;
    display: block;
  }

  .row.header {
    padding: 0;
    height: 6px;
  }

  .row.header .cell {
    display: none;
  }

  .row .cell {
    margin-bottom: 10px;
  }

  .row .cell:before {
    margin-bottom: 3px;
    content: attr(data-title);
    min-width: 98px;
    font-size: 10px;
    line-height: 10px;
    font-weight: bold;
    text-transform: uppercase;
    color: #969696;
    display: block;
  }
}

.cell {
  padding: 6px 12px;
  display: table-cell;
}


@media screen and (max-width: 580px) {
  .cell {
    padding: 2px 16px;
    display: block;
  }
}
</style>