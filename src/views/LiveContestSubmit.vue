<template>
  <div v-if="showPage" style="justify-content: center; display: flex;">
    <form action="" @submit.prevent="createContest">
      <div>
        <h2 style="color: blue;">Create New Contest</h2>
        <div>
          <label for="contestName">Contest Name:</label>
          <input required type="text" id="contestName" v-model="contestName" />
        </div>
        <br>
        <div>
          <label for="xmlFile">Select an XML file:</label>
          <input required ref="fileInput" type="file" id="xmlFile" accept=".xml" @change="handleFileUpload">
        </div>
        <br>
        <div>
          <label for="imageFiles">Upload Images:</label>
          <input type="file" id="imageFiles" multiple @change="handleImageFilesUpload" />
        </div>

        <br>
        <button class="button" type="submit">Create Contest</button>
      </div>
    </form>

  </div>

  <div class="vld-parent">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

  </div>
</template>
    
<script setup>
import { reactive, ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { computed } from 'vue';
import { useStore } from 'vuex';
import { getDatabase, ref as firebaseRef, set, get, child, } from "firebase/database";
import Loading from 'vue-loading-overlay';

const isLoading = ref(false)
const fullPage = ref(true)

const db = getDatabase()
const dbRef = firebaseRef(db)
const store = useStore()
const storage = getStorage();
const functions = getFunctions()
const userId = computed(() => store.state.userId)

const processXmlQuestions = httpsCallable(functions, 'processXmlQuestions',)
const checkContestAccess = httpsCallable(functions, 'checkContestAccess',)
const fileInput = ref(null)
var selectedXmlFile
var imageFiles
const contestName = ref('')
const democontests = reactive([])
const showPage = ref(true)

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  console.log('files', file)
  file.text().then((result) => { console.log('filetext', result) })
  selectedXmlFile = file
}

const handleImageFilesUpload = (event) => {
  imageFiles = event.target.files;
}

const submitFile = async () => {

  for (let i = 0; i < imageFiles.length; i++) {
    var selectedFile = imageFiles[i]
    await uploadBytes(firebaseStorageRef(storage, 'livecontest/' + contestName.value + '/' + selectedFile.name), selectedFile).then((snapshot) => {
      console.log('Uploaded a blob or file!');

    }).catch((error) => {
      console.log(error.message)
      alert("Submit error. Couldn't submit the answer")
    });
  }

  await uploadBytes(firebaseStorageRef(storage, 'livecontest/' + contestName.value + '/' + selectedXmlFile.name), selectedXmlFile).then((snapshot) => {
    console.log('Uploaded a blob or file!');

  }).catch((error) => {
    console.log(error.message)
    alert("Submit error. Couldn't submit the answer")
  });

}

const createContest = async () => {

  isLoading.value = true;
  var xmlString

  await selectedXmlFile.text().then((result) => { xmlString = result })
  await processXmlQuestions({ xmlString: xmlString, contestName: contestName.value, contestType: "livecontest" }).then((result) => {
    console.log('data', result)
  })
  await submitFile()
  await getDemoContests()
  isLoading.value = false;
}

</script>
    
<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';

.button {
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  padding: 10px 15px;
  gap: 15px;
  background-color: #007ACC;
  outline: 3px #007ACC solid;
  outline-offset: -3px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: 400ms;
}

.button .text {
  color: white;
  font-weight: 700;
  font-size: 1em;
  transition: 400ms;
}

.button svg path {
  transition: 400ms;
}

.button:hover {
  background-color: transparent;
  color: #007ACC;
}

.button:hover .text {
  color: #007ACC;
}

.button:hover svg path {
  fill: #007ACC;
}
</style>