<script setup>
import { ref } from 'vue';
import ImagePreview2Vue from '../ImagePreview2.vue';

const props = defineProps({
  filesUploaded: Array
})

const emits = defineEmits(['onFilesChange'])

const userFiles = ref(props.filesUploaded)

const handleGetFiles = (imageFiles) => {
    userFiles.value = imageFiles
    emits('onFilesChange', userFiles.value)
}

</script>

<template v-cloak>
  <div style="padding: 10px; width: 100%;">    
      <ImagePreview2Vue @get-files="handleGetFiles" :files="userFiles">
      </ImagePreview2Vue>
  </div>
</template>

<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';
</style>


