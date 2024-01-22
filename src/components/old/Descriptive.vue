<script setup>
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref } from "vue";
import ImagePreviewVue from "./ImagePreview.vue";
import ImagePreview2Vue from "./ImagePreview2.vue";
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL, getStream } from "firebase/storage";
import {
  getDatabase,
  ref as firebaseRef,
  set,
  get,
  child,

} from "firebase/database";
import { getQuestionData } from '../utility/getContentData';
import ContentView from './ContentView.vue';

import Loading from 'vue-loading-overlay';
const isLoading = ref(false)
const fullPage = ref(true)

const downloaded = ref(false)
const store = useStore();
const storage = getStorage();
const db = getDatabase();
const dbRef = firebaseRef(db);
const props = defineProps({
  question: Array,
  questionLocation: String,
  questionOrder: Number,
  contestType: String,
  contestName: String,
  submissionType: String,
})

const userId = computed(() => store.state.userId)

const files = ref([])
const questionParts = reactive([])
const imagePreviewRef = ref(null)
const imagesDownloaded = ref(false)
const questionData = computed(() => store.state.questionData)

defineExpose({
  async save() {
    try {
      
    
    const snapshot = await set(firebaseRef(db, props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/images/"), null)
    const storage = getStorage();
    var storageRef
    const tempFiles = []
    let pushToDataBase = []
    for (let i = 0; i < files.value.length; i++) {
      storageRef = firebaseStorageRef(storage, props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/" + files.value[i].name);
      await uploadBytes(storageRef, files.value[i]).then(async (snapshot) => {
        tempFiles.push(files.value[i])
        // pushToDataBase.push = props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/" + files.value[i].name
        await set(
        firebaseRef(db, props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/images/" + i),
        props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/" + files.value[i].name
      )
      })
        .catch((error) => {
          console.log(error.message);
        });
    
    }
    if((files.value == '' || files.value == [] || files.value == null) && questionData.value["answerstatus"][props.questionLocation] ){
      questionData.value["answerstatus"][props.questionLocation] = false
      store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value - 1)
      store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value + 1)
    }
    else if(files.value != '' && files.value != [] && files.value != null && !questionData.value["answerstatus"][props.questionLocation]){
      questionData.value["answerstatus"][props.questionLocation] = true
      store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value + 1)
      store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value - 1)
    }
    if(questionData.value[props.questionLocation] == null)
    questionData.value[props.questionLocation] = {}
    questionData.value[props.questionLocation].files = tempFiles
    store.commit('setQuestionData', questionData.value)

  } catch (error) {
      console.log(error)
      alert('could not submit')
    }

  },
  async clear() {
    // console.log('clear')
    files.value.splice(0, files.value.length)
  }
})
onMounted(async () => {
  isLoading.value = true
  if(questionData.value[props.questionLocation] != null && questionData.value[props.questionLocation].questionParts != null){
    questionParts.splice(0, questionParts.length)
    questionParts.push(...questionData.value[props.questionLocation].questionParts)
  } else {
  await getQuestionData(props, userId, questionParts)
  if(questionData.value[props.questionLocation] == null)
  questionData.value[props.questionLocation] = {}
  questionData.value[props.questionLocation].questionParts = questionParts
  store.commit('setQuestionData', questionData.value)
  }
  isLoading.value = false
  downloaded.value = true
  if(questionData.value[props.questionLocation] != null && questionData.value[props.questionLocation].files != null){
    files.value.push(...questionData.value[props.questionLocation].files)
  }
  else {
  const snapshot = await get(child(dbRef, `${props.submissionType}contestsubmission/${props.contestName}/${userId.value}/answers/${props.questionLocation}/images`), )
  const imagePaths = snapshot.val()
  if (imagePaths != null) {
    for (let i = 0; i < imagePaths.length; i++) {
      const url = await getDownloadURL(firebaseStorageRef(storage, imagePaths[i]),);
      const response = await fetch(url); // Fetch the image from the URL
      const blob = await response.blob(); // Convert the fetched data into a Blob

      // Create a File object
      const file = new File([blob], `image${Math.floor(Math.random() * 100).toString()}`, { type: blob.type });

      files.value.push(file)

    }
    // console.log('files', files)
  }
  if(questionData.value[props.questionLocation] == null)
  questionData.value[props.questionLocation] = {}
  questionData.value[props.questionLocation].files = files.value
  store.commit('setQuestionData', questionData.value)
}

  imagesDownloaded.value = true
})

const handleGetFiles = (imageFiles) => {
  // console.log('handleGetFiles')
  files.value = imageFiles;
}
</script>

<template v-cloak>
  <div style="padding: 10px; width: 100%;" v-if="downloaded">
    <ContentView :content-parts="questionParts"></ContentView>

    <div class="vld-parent" style="display: flex; justify-content: center;">
      <Loading style="position: relative;" :active.sync="!imagesDownloaded" :can-cancel="true" :is-full-page="false">
        </Loading>
        <div v-if="!imagesDownloaded" style="margin: 10px;">Fetching your uploaded answers ...</div>
    </div>
    
      <ImagePreview2Vue v-if="imagesDownloaded" ref="imagePreviewRef" @get-files="handleGetFiles" :files="files">

      </ImagePreview2Vue>

    

  </div>
  <!-- <div v-if="isLoading" style="position: absolute;display: flex;justify-content: center;align-items: center;height: 100%;width: 100%;">
    <Loading style="position: relative;" :active.sync="isLoading" :can-cancel="true" :is-full-page="false"></Loading>

  </div> -->
</template>

<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';
</style>


