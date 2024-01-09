<script setup>
    import { parseLatex } from '../utility/parseLatex';
    import { ref } from 'vue'
    // import '../assets/mathjax/tex-chtml-full'
    const vmkey = ref(0)
    const vmath = ref(null)
    const props = defineProps({
        contentParts: Array
    })
</script>
<template>
    
    <div>
      <div v-for="questionPart,index in contentParts" :key="index">
        <div v-if="questionPart.type=='text'" style="font-size: x-large;line-height: 2rem;" >
          <vue-mathjax ref="vmath" :key="vmkey" :formula="parseLatex(questionPart.data)" />
        </div>
        <div v-else-if="questionPart.type=='image'">
          <img style="max-width:98%;max-height:80vh; " class="question-image" :src="questionPart.data" alt="image"/>
        </div>
      </div>
    </div>
</template>