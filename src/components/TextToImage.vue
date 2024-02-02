<template>
    <div>
      <img :src="dataUri" alt="image">
    </div>
  </template>
  
  <script setup>
    import { generateImage } from '../utility/textToImage'
    import { ref,onMounted } from 'vue';

    const props = defineProps({
        text: String,
    })
    const dataUri = ref(null)

    onMounted(async ()=>{
        const data = await generateImage(props.text);
        dataUri.value = data
    })
  </script>
  
  <style scoped>
 
  </style>
  