<script setup>
import SingleCorrectVue from "./SingleCorrect.vue";
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref } from "vue";
import {
  getDatabase,
  ref as firebaseRef,
  set,
  get,
  child,

} from "firebase/database";

import Loading from 'vue-loading-overlay';
const isLoading = ref(false)
const fullPage = ref(true)

const store = useStore();
const db = getDatabase();
const dbRef = firebaseRef(db);
const props = defineProps({
  question: Array,
  answers: Array,
  questionLocation: String,
  questionOrder: Number,
  contestType: String,
  contestName: String,
  submissionType: String,
})

const userId = computed(() => store.state.userId)
const questionData = computed(() => store.state.questionData)

var options = reactive([])
var selectedToggle = ref([])
var optionSelected = null

onMounted(async () => {
  
  isLoading.value = true
  let userAnswers = []
  
  initializeOptions(props.answers);
  if(questionData.value[props.questionLocation] != null && questionData.value[props.questionLocation].userAnswers != null){
    userAnswers.splice(0, userAnswers.length)
    userAnswers.push(...questionData.value[props.questionLocation].userAnswers)
    for (var i = 0; i < userAnswers.length; i++) {
          const selectedIndex = parseInt(userAnswers) - 1;
          selectedToggle.value[selectedIndex] = "selected";
          optionSelected = userAnswers

        }
    }
    else {

    // console.log(props.submissionType)
  const snapshot = await get(child(dbRef, props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + `answers/` + props.questionLocation + "/options"))
      if (snapshot.exists()) {
        userAnswers = snapshot.val();
        if(questionData.value[props.questionLocation] == null)
        questionData.value[props.questionLocation] = {}
        questionData.value[props.questionLocation].userAnswers = userAnswers
        store.commit('setQuestionData', questionData.value)
        
        for (var i = 0; i < userAnswers.length; i++) {
          const selectedIndex = parseInt(userAnswers) - 1;
          selectedToggle.value[selectedIndex] = "selected";
          optionSelected = userAnswers

        }
      }
    }

  isLoading.value = false
})

const initializeOptions = (answers) => {
  // const options = reactive([]);
  for (let i = 0; i < answers.length; i++) {
    const element = answers[i];
    options.push({
      index: i,
      id: (i + 1).toString(),
      label: element,
    });
  }
  // return options;
}

defineExpose({
  async save() {
    //null true - a- , u+
    //null false no change
    //not null true no change
    //not null false
    
    
    await set(
      firebaseRef(db, props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/options"),
      optionSelected
    )
      .then((result) => {
        if(questionData.value[props.questionLocation] == null)
        questionData.value[props.questionLocation] = {}
        questionData.value[props.questionLocation].userAnswers = optionSelected
        store.commit('setQuestionData', questionData.value)
        if((optionSelected == '' || optionSelected == [] || optionSelected == null) && questionData.value["answerstatus"][props.questionLocation] ){
      questionData.value["answerstatus"][props.questionLocation] = false
      store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value - 1)
      store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value + 1)
      
    }
    if(optionSelected != '' && optionSelected != [] && optionSelected != null && !questionData.value["answerstatus"][props.questionLocation]){
      
      questionData.value["answerstatus"][props.questionLocation] = true
      store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value + 1)
      store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value - 1)
    }
      })
      .catch((e) => {
        console.log(e.message);
        alert('could not submit')
      });

      
  },
  async clear() {
    optionSelected = null
    //clear selected Toggle
    // console.log('selected toggle', selectedToggle.value)
    for (let i = 0; i < selectedToggle.value.length; i++) {
      selectedToggle.value[i] = ""
    }
    // console.log('selected toggle', selectedToggle.value)

  }
})

const handleOptionSelected = (value) => {
  optionSelected = value
}

</script>
<template>
  <SingleCorrectVue style="margin: auto" :questionOrder="questionOrder" :options="options" :question="question"
    :selected-toggle="selectedToggle" :contest-name="contestName" :contest-type="contestType"
    @get-option-selected="handleOptionSelected"></SingleCorrectVue>

    <!-- <div v-if="isLoading" style="position: absolute;display: flex;justify-content: center;align-items: center;height: 100%;width: 100%;">
    <Loading style="position: relative;" :active.sync="isLoading" :can-cancel="true" :is-full-page="false"></Loading>
    </div> -->

  
</template>

<style>
  .vld-parent {
    position: relative;
    width: 100%;
    height: 100%;
    top: 50;
    left: 50;
  }
</style>
