<script setup>
import { reactive, ref } from 'vue'
import OptionStatement from './OptionStatement.vue';

const props = defineProps({
  optionsArray: Array,
  optionsChosen: Array
})

const optionsSelected = props.optionsChosen != null ? reactive(props.optionsChosen) : reactive([])
const selectedToggle = ref(Array.from({ length: props.optionsArray.length }, () => ''))

for (let i = 0; i < optionsSelected.length; i++) {
  selectedToggle.value[optionsSelected[i] - 1] = 'selected'
}

const emits = defineEmits(['get-options-selected'])
const sendData = (index) => {
  if (selectedToggle.value[index] == 'selected') {
    selectedToggle.value[index] = ''
    optionsSelected.splice(optionsSelected.indexOf(props.optionsArray[index].id), 1)
  }
  else {
    selectedToggle.value[index] = 'selected'
    optionsSelected.push(props.optionsArray[index].id)
  }
  // console.log('emitoptionsselected', optionsSelected)
  emits('get-options-selected', optionsSelected);
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