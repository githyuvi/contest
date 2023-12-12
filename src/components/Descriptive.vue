<script setup>
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref } from "vue";
import ImagePreviewVue from "./ImagePreview.vue";
import { getStorage , ref as firebaseStorageRef, uploadBytes, getDownloadURL, getStream} from "firebase/storage";
import {
  getDatabase,
  ref as firebaseRef,
  set,
  get,
  child,
  
} from "firebase/database";

const questionHtml = ref('')
const vmathText = ref('\(k \\in \\mathbb{Z}^{+}\)')
const vmath = ref(null)
const vmkey = ref(0)
const downloaded = ref(false)
const store = useStore();
const storage = getStorage();
const db = getDatabase();
const dbRef = firebaseRef(db);
const props = defineProps({
    question: Array,
    questionLocation: String,
    questionOrder: String,
    contestType: String,
    contestName: String,
})

const userId = computed(() => store.state.userId)
const userName = computed(() => store.state.userName)
const userEmail = computed(() => store.state.userEmail)
const isLoggedIn = computed(() => store.state.isLoggedIn)

var options = reactive([])
var selectedToggle = reactive([])
var optionSelected = ref('')
var files = []
function replaceWithDollars(inputString) {
  // Using regular expressions to replace \( and \) with $$
  // let replacedString = inputString.replace(/\\\(/g, '$$').replace(/\\\)/g, '$$');
  let replacedString = inputString.replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$').replace(/\\\(/g, '$$').replace(/\\\)/g, '$$')
  return replacedString;
}


defineExpose({
  async save() {
    if(files.length > 0){
        console.log('files length', files.length)
      await set( firebaseRef(db,"livecontestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/images/"),null)
      const storage = getStorage();
      var storageRef
      for(let i = 0;i<files.length;i++){
        storageRef = firebaseStorageRef(storage, "livecontestsubmission/" + props.contestName + "/" + userId.value + "/" +  "answers/" + props.questionLocation + "/" + files[i].name);
        await uploadBytes(storageRef, files[i]).then(async (snapshot) => {
            console.log('Uploaded a blob or file!');
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
  }
})
onMounted(async () => {
  var baseReference
  if(props.contestType == 'democontest')
  baseReference = 'democontest/' + userId.value + '/' + props.contestName + '/'
  if(props.contestType == 'livecontest')
  baseReference = 'livecontest/' + props.contestName + '/'
      const questionArray = Array.from(Object.values(props.question))[0]
      
      for(let i = 0; i < questionArray.length; i++){
        var objectkey = Object.keys(questionArray[i])[0]
        
        if(objectkey == 'text')
        questionHtml.value += questionArray[i][objectkey]
        else if(objectkey == 'image') {
          var imageUrl
          var pathReference
          pathReference = firebaseStorageRef(storage, baseReference + questionArray[i][objectkey]); 
          await getDownloadURL(pathReference)
          .then((url) => {
            imageUrl = url
          })
          .catch((error) => {
            // Handle any errors
          });
          questionHtml.value += '<img style="max-width:98%;max-height:80vh" src="' + imageUrl + '">'
        }
      }
      // console.log("questionHTML ", questionHtml.value)
      vmathText.value = replaceWithDollars(questionHtml.value)
      // console.log("vmathText ", vmathText.value)
      downloaded.value = true
})

const handleGetFiles = (imageFiles) => {
  files = imageFiles;
}
</script>

<template v-cloak>
  <div class="container" v-if="downloaded">
    <h2> Question {{ questionOrder }}</h2>
    <vue-mathjax ref="vmath" :key="vmkey" :formula="vmathText"/>
    
    <br>
    <div style="margin-bottom: 50px;">
    <ImagePreviewVue @get-files="handleGetFiles">
      
    </ImagePreviewVue>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  /* justify-content: center;  */
  align-items: center;
  /* height: 100vh; */
}
</style>


