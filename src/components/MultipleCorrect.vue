<script setup>
import { onMounted, ref } from 'vue'
import { getStorage, ref as firebaseStorageRef, getDownloadURL} from "firebase/storage";
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const userId = computed(() => store.state.userId)
const storage = getStorage();

const props = defineProps({
    questionOrder: String,
    question: Array,
    options: Array,
    selectedToggle: Array,
    optionsSelected: Array,
    contestType: String,
    contestName: String,
})

const questionHtml = ref('')
const  downloaded = ref(false)

const emits = defineEmits(['get-options-selected'])

const sendData = (index) => {
  if(props.selectedToggle[index] == 'selected'){
      props.selectedToggle[index] = ''
      props.optionsSelected.splice(props.optionsSelected.indexOf(props.options[index].id), 1)
  }
  else {
      props.selectedToggle[index] = 'selected'
      props.optionsSelected.push(props.options[index].id)
  }                
  console.log('emitoptionsselected',props.optionsSelected)
  emits('get-options-selected' , props.optionsSelected);
}
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
        questionHtml.value += '<div>' + questionArray[i][objectkey] + '</div>'
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
      downloaded.value = true
})

   

</script>

<template v-cloak>
    <div class="wrapper" style="text-align: center;" v-if="downloaded">
      <h2> Question {{ questionOrder }}</h2>
    <div v-html="questionHtml"></div>
    <div class="poll-area" >
        <div v-for='option in options' :key='option.id'>
            <input type="radio" name="poll" :id="'opt-' + option.id" :value="option.id" >
            <label :for="'opt-' + option.id" :class="'opt-' + option.id" @click="sendData(option.index)" v-bind:class="selectedToggle[option.index]"  >
                <div class="row">
                    <div class="column">
                        <span class="circle"></span>
                        <span class="text">{{ option.label }}</span>
                    </div>
                </div>
            </label>

        </div>

    </div>
        
    
  </div>
  
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
body{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #6665ee;
}
::selection{
  color: #fff;
  background: #6665ee;
}
.wrapper{
  /* background: #fff; */
  border-radius: 15px;
  padding: 2px;
  /* max-width: fit-content; */
  width: 100%;
  max-width: 900px;
  box-shadow: 0px 5px 10px rgba(0,0,0,0.1);
}
.wrapper header{
  font-size: 22px;
  font-weight: 600;
}
.wrapper .poll-area{
  margin: 20px 0 15px 0;
}
.poll-area label{
  display: block;
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 8px 15px;
  border: 2px solid #e6e6e6;
  transition: all 0.2s ease;
}
/* .poll-area label:hover{
  border-color: #ddd;
} */
label.selected{
  border-color: #6665ee!important;
}
label .row{
  display: flex;
  pointer-events: none;
  justify-content: space-between;
}
label .row .column{
  display: flex;
  align-items: center;
}
label .row .circle{
  height: 19px;
  width: 19px;
  display: block;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
}
label.selected .row .circle{
  border-color: #6665ee;
}
label .row .circle::after{
  content: "";
  height: 11px;
  width: 11px;
  background: #6665ee;
  border-radius: inherit;
  position: absolute;
  left: 2px;
  top: 2px;
  display: none;
}
.poll-area label:hover .row .circle::after{
  display: block;
  background: #e6e6e6;
}
label.selected .row .circle::after{
  display: block;
  background: #6665ee!important;
}
label .row span{
  font-size: 16px;
  font-weight: 500;
}
label .row .percent{
  display: none;
}
label .progress{
  height: 7px;
  width: 100%;
  position: relative;
  background: #f0f0f0;
  margin: 8px 0 3px 0;
  border-radius: 30px;
  display: none;
  pointer-events: none;
}
label .progress:after{
  position: absolute;
  content: "";
  height: 100%;
  background: #ccc;
  width: calc(1% * var(--w));
  border-radius: inherit;
  transition: all 0.2s ease;
}
label.selected .progress::after{
  background: #6665ee;
}
label.selectall .progress,
label.selectall .row .percent{
  display: block;
}
input[type="radio"],
input[type="checkbox"]{
  display: none;
}
</style>
