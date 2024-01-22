<script setup>
import { ref } from 'vue'
import OptionStatement from './OptionStatement.vue';

const props = defineProps({
  optionsArray: Array,
  optionChosen: Number
})

const optionSelected = ref(props.optionChosen)
const selectedToggle = ref(Array.from({ length: props.optionsArray.length }, () => ''))
selectedToggle.value[props.optionChosen - 1] = 'selected'

const emits = defineEmits(['get-option-selected'])
const sendData = (index) => {
  selectedToggle.value[index] = 'selected'
  for (var i = 0; i < selectedToggle.value.length; i++) {
    if (i == index) {
      selectedToggle.value[i] = 'selected'
    }
    else {
      selectedToggle.value[i] = ''
    }
  }
  optionSelected.value = props.optionsArray[index].id
  emits('get-option-selected', optionSelected.value);
}

</script>

<template v-cloak>
    <div class="poll-area">
      <div v-for='option in props.optionsArray' :key='option.id'>
        <input type="radio" name="poll" :id="'opt-' + option.id" :value="option.id">
        <label :for="'opt-' + option.id" :class="'opt-' + option.id" @click="sendData(option.index)"
          v-bind:class="selectedToggle[option.index]">
          <div class="row">
            <div class="column">
              <span class="circle"></span>
              <span class="text"> <OptionStatement :content-parts="option.optionParts"></OptionStatement>  </span>
            </div>
          </div>
        </label>
      </div>
    </div>
</template>

<style scoped>
@import "../../assets/multiplechoice.css";
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');

[v-cloak] {
  display: none;
}
</style>
