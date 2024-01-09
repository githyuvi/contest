<script setup>
import { onMounted, reactive, ref } from 'vue'
import { computed } from 'vue';
import { useStore } from 'vuex';
import { getQuestionData, getOptionsData } from '../utility/getContentData';
import ContentView from './ContentView.vue';

const store = useStore()
const userId = computed(() => store.state.userId)
const questionData = computed(() => store.state.questionData)

const props = defineProps({
  questionOrder: Number,
  question: Array,
  options: Array,
  selectedToggle: Array,
  optionsSelected: Array,
  contestType: String,
  contestName: String,
})

const questionParts = reactive([])
const optionsArray = reactive([])
const downloaded = ref(false)
const selectedToggle = ref(props.selectedToggle)

const emits = defineEmits(['get-options-selected'])

const sendData = (index) => {
  if (selectedToggle.value[index] == 'selected') {
    selectedToggle.value[index] = ''
    props.optionsSelected.splice(props.optionsSelected.indexOf(props.options[index].id), 1)
  }
  else {
    selectedToggle.value[index] = 'selected'
    props.optionsSelected.push(props.options[index].id)
  }
  // console.log('emitoptionsselected', props.optionsSelected)
  emits('get-options-selected', props.optionsSelected);
}
onMounted(async () => {
  const questionLocation = 'q' + props.questionOrder
  if(questionData.value[questionLocation] != null && questionData.value[questionLocation].questionParts != null){
    questionParts.splice(0, questionParts.length)
    questionParts.push(...questionData.value[questionLocation].questionParts)
    }
    else {
  await getQuestionData(props, userId,questionParts)
  if(questionData.value[questionLocation] == null)
  questionData.value[questionLocation] = {}
  questionData.value[questionLocation].questionParts = questionParts
  store.commit('setQuestionData', questionData.value)

  }
  if(questionData.value[questionLocation] != null && questionData.value[questionLocation].optionsArray != null){
    optionsArray.splice(0, optionsArray.length)
    optionsArray.push(...questionData.value[questionLocation].optionsArray)
    } 
    else {
  await getOptionsData(props, userId, props.options, optionsArray)
  if(questionData.value[questionLocation] == null)
  questionData.value[questionLocation] = {}
  questionData.value[questionLocation].optionsArray = optionsArray
  store.commit('setQuestionData', questionData.value)
    }
  downloaded.value = true
})



</script>

<template v-cloak>
  <div class="wrapperContest" v-if="downloaded">
    <!-- <div v-html="questionHtml"></div> -->
    <ContentView :content-parts="questionParts"></ContentView>
    
    <div class="poll-area">
      <div v-for='option in optionsArray' :key='option.id'>
        <input type="radio" name="poll" :id="'opt-' + option.id" :value="option.id">
        <label :for="'opt-' + option.id" :class="'opt-' + option.id" @click="sendData(option.index)"
          v-bind:class="selectedToggle[option.index]">
          <div class="row">
            <div class="column">
              <span class="circle" ></span>
              <span class="text"> <ContentView :content-parts="option.optionParts"></ContentView>  </span>
            </div>
          </div>
          
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/multiplechoice.css";

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');


[v-cloak] {
  display: none;
}
</style>
