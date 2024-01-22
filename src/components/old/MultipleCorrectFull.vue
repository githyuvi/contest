<script setup>
import MultipleCorrectVue from "./MultipleCorrect.vue";
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref } from "vue";
import { getStorage , ref as firebaseStorageRef, uploadBytes, getDownloadURL} from "firebase/storage";
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
    submissionType: String
})

const userId = computed(() => store.state.userId)
const questionData = computed(() => store.state.questionData)

var options = reactive([])
var selectedToggle = ref([])
var optionsSelected = ref([])

onMounted(async() => {
  isLoading.value = true
  getToggles();
  initializeOptions(props.answers)

  let userAnswers = []

  if(questionData.value[props.questionLocation] != null && questionData.value[props.questionLocation].userAnswers != null){
    userAnswers.splice(0, userAnswers.length)
    userAnswers.push(...questionData.value[props.questionLocation].userAnswers)
    for (var i = 0; i < userAnswers.length; i++) {
          const selectedIndex = parseInt(userAnswers[i]) - 1;
          selectedToggle.value[selectedIndex] = "selected";
          optionsSelected.value.push(userAnswers[i])
        }
    }
    else {
  await get(child(dbRef,props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" +  `answers/` + props.questionLocation + "/options"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        userAnswers = snapshot.val();
        if(questionData.value[props.questionLocation] == null)
        questionData.value[props.questionLocation] = {}
        questionData.value[props.questionLocation].userAnswers = userAnswers
        store.commit('setQuestionData', questionData.value)
        
        for (var i = 0; i < userAnswers.length; i++) {
          const selectedIndex = parseInt(userAnswers[i]) - 1;
          selectedToggle.value[selectedIndex] = "selected";
          optionsSelected.value.push(userAnswers[i])
        }
      }
    })
    .catch((error) => {
      console.log(error);
      alert("couldn't fetch results");
    });
  }
    isLoading.value = false
})

const getToggles = () => {
  const length = props.answers.length;
  const toggles = ref([]);
  for (var i = 0; i < length; i++) {
    toggles.value.push("");
  }
  return toggles;

}

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
    
    await set(
    firebaseRef(db,props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/options"),
    optionsSelected.value
  )
  .then((value) => {
    if(questionData.value[props.questionLocation] == null)
    questionData.value[props.questionLocation] = {}
    questionData.value[props.questionLocation].userAnswers = optionsSelected.value
    store.commit('setQuestionData', questionData.value)
    if((optionsSelected.value == '' || optionsSelected.value == [] || optionsSelected.value == null) && questionData.value["answerstatus"][props.questionLocation] ){
      questionData.value["answerstatus"][props.questionLocation] = false
      store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value - 1)
      store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value + 1)
    }
    else if(optionsSelected.value != '' && optionsSelected.value != [] && optionsSelected.value != null && !questionData.value["answerstatus"][props.questionLocation]){
      questionData.value["answerstatus"][props.questionLocation] = true
      store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value + 1)
      store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value - 1)
    }
    })
  .catch((e) => {
      console.log(e.message);
      alert("Submit error. Couldn't submit the answer");
  });
  },
  async clear(){
    optionsSelected.value = []
    //clear selected Toggle
    for(let i = 0;i<selectedToggle.value.length;i++){
      selectedToggle.value[i] = ""
    }


  }
})

const handleOptionSelected =(value)=> {
  optionsSelected.value = value
}


</script>
<template>
  
    <MultipleCorrectVue
    :questionOrder="questionOrder"
      style="margin: auto"
      :options="options"
      :question="question"
      :selected-toggle="selectedToggle"
      @get-options-selected="handleOptionSelected"
      :options-selected="optionsSelected"
      :contest-name="contestName"
      :contest-type="contestType"
    ></MultipleCorrectVue>
    <div>

  </div>
  <!-- <div v-if="isLoading" style="position: absolute;display: flex;justify-content: center;align-items: center;height: 100%;width: 100%;">
    <Loading style="position: relative;" :active.sync="isLoading" :can-cancel="true" :is-full-page="false"></Loading>
  </div> -->
  
</template>

<style>
</style>
