<template>
    <div class="flex justify-center">
        <form @submit.prevent="" class="max-w-md p-4 bg-white shadow-md rounded-md">
            <div>
                
                <div class="mb-4">
                    <label for="contestName" class="block text-gray-600">Contest Name:</label>
                    <input required type="text" id="contestName" v-model="contestName"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
                <div class="mb-4">
                    <label for="xmlFile" class="block text-gray-600">Select an XML file:</label>
                    <input required ref="fileInput" type="file" id="xmlFile" accept=".xml" @change="handleFileUpload"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
                <div class="mb-4">
                    <image-preview2 :max-files="1000" :files="imageFiles" @get-files="handleGetFiles"></image-preview2>
                </div>
                <div>
                    <button @click="createContest" type="submit"
                        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                        Create Contest
                    </button>
                </div>
            </div>
        </form>
    </div>

    <div class="vld-parent">
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    </div>
</template>
      
<script setup>
import { onBeforeMount, ref } from 'vue'
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from 'vue-loading-overlay';
import ImagePreview2 from '../../components/ImagePreview2.vue';
import axios from 'axios'

const isLoading = ref(false)
const fullPage = ref(true)
const storage = getStorage();
const functions = getFunctions()
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);

const processXmlQuestions = httpsCallable(functions, 'processXmlQuestions',)
const fileInput = ref(null)
var selectedXmlFile
const imageFiles = ref([])
const contestName = ref('')
const showPage = ref(true)
const questionDemoUrl = ref('')

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('files', file)
    file.text().then((result) => { console.log('filetext', result) })
    selectedXmlFile = file
}

const handleGetFiles = (value) => {
    imageFiles.value = value
}
const submitFile = async () => {
    if (imageFiles.value != null) {
        for (let i = 0; i < imageFiles.value.length; i++) {
            var selectedFile = imageFiles.value[i]
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
}

const createContest = async () => {

    isLoading.value = true;
    var xmlString

    await selectedXmlFile.text().then((result) => { xmlString = result })
    await processXmlQuestions({ xmlString: xmlString, contestName: contestName.value, contestType: "livecontest" }).then((result) => {
        console.log('data', result)
    })
    await submitFile()
    // await getDemoContests()
    isLoading.value = false;
}


// onBeforeMount(async() => {
//   var pathReference = firebaseStorageRef(storage, 'resources/questions.xml');
//   await getDownloadURL(pathReference)
//     .then((url) => {
//       questionDemoUrl.value = url
//   })
// })

</script>
      
<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';

</style>