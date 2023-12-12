<script setup>
  import { reactive,ref } from 'vue';
import ImagePreview from '../components/ImagePreview.vue';
const imageFiles = ref([])

const handleImageFiles = (files) => {
  imageFiles.value = files
  console.log('imageFiles', imageFiles)
}

</script>

<template>
  <div>
    <ImagePreview @get-files="handleImageFiles">

    </ImagePreview>
  </div>
</template>