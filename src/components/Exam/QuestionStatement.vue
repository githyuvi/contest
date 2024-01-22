<template>
  <div class="statement-container">
    <div v-for="questionPart, index in contentParts" :key="index">
      <div v-if="questionPart.type == 'text'" class="text-xl leading-8">
        <vue-mathjax ref="vmath" :key="vmkey" :formula="parseLatex(questionPart.data)" />
      </div>
      <div v-else-if="questionPart.type == 'image'">
        <img class="max-w-98 max-h-80vh question-image" :src="questionPart.data" alt="image" />
      </div>
    </div>
  </div>
</template>

<script setup>

import { parseLatex } from '../../utility/parseLatex';
import { ref } from 'vue'

const vmkey = ref(0)
const vmath = ref(null)


const props = defineProps({
  contentParts: Array
})

</script>

<style lang="scss" scoped></style>