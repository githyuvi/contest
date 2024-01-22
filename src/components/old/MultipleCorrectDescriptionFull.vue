<script setup>
import MultipleCorrectVue from "./MultipleCorrect.vue";
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref } from "vue";
import ImagePreviewVue from "./ImagePreview.vue";
import { getStorage , ref as firebaseStorageRef, uploadBytes, getDownloadURL} from "firebase/storage";
import {
  getDatabase,
  ref as firebaseRef,
  set,
  get,
  child,
  
} from "firebase/database";

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
})

const userId = computed(() => store.state.userId)
const userName = computed(() => store.state.userName)
const userEmail = computed(() => store.state.userEmail)
const isLoggedIn = computed(() => store.state.isLoggedIn)

var options = reactive([])
var selectedToggle = reactive([])
var optionsSelected = reactive([])
var files = []

onMounted(async() => {
  initializeOptions(props.answers);
  await get(child(dbRef,"livecontestsubmission/" + props.contestName + "/" + userId.value + "/" +  `answers/` + props.questionLocation + "/options"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userAnswers = snapshot.val();
        for (var i = 0; i < userAnswers.length; i++) {
          const selectedIndex = parseInt(userAnswers[i]) - 1;
          selectedToggle[selectedIndex] = "selected";
          optionsSelected.push(userAnswers[i])
        }
      }
    })
    .catch((error) => {
      console.log(error);
      alert("couldn't fetch results");
    });
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
    await set(
    firebaseRef(db,"livecontestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/options"),
    optionsSelected
  )
  .then((value) => {
    })
  .catch((e) => {
      console.log(e.message);
      alert("Submit error. Couldn't submit the answer");
  });

  if(files.length > 0){
    await set( firebaseRef(db,"livecontestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/images/"),null)
    const storage = getStorage();
    var storageRef
    for(let i = 0;i<files.length;i++){
      storageRef = firebaseStorageRef(storage, "livecontestsubmission/" + props.contestName + "/" + userId.value + "/" +  "answers/" + props.questionLocation + "/" + files[i].name);
      await uploadBytes(storageRef, files[i]).then(async (snapshot) => {
      })
      .catch((error) => {
          console.log(error.message);
          alert("Submit error. Couldn't submit the answer");
      });
      await set(
          firebaseRef(db,"livecontestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/images/" + i),
          "livecontestsubmission/" + props.contestName + "/" + userId.value + "/" +  "answers/" + props.questionLocation + "/" + files[i].name
        )
    }
  }
  },
  async clear(){
    optionsSelected = []
    selectedToggle = []
    files = []
  }
})

const handleOptionSelected =(value)=> {
  optionsSelected = value
}
const handleGetFiles = (imageFiles) => {
  files = imageFiles;
}


</script>

<template>
  <div>
    <MultipleCorrectVue
    :question-order="questionOrder"
      style="margin: auto"
      :options="options"
      :question="question"
      :selected-toggle="selectedToggle"
      @get-options-selected="handleOptionSelected"
      :options-selected="optionsSelected"
      v-bind:question-order="questionOrder"
      :contest-name="contestName"
      :contest-type="contestType"
    ></MultipleCorrectVue>
  </div>
  
  <div>
    <ImagePreviewVue :question-order="questionOrder" :contest-name="contestName" @get-files="handleGetFiles">
      
    </ImagePreviewVue>
  </div>
  
</template>

<style>
</style>
