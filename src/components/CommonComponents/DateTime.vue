<template>
  <div class="mb-4">
    <label for="datetime" class="block text-gray-600">{{ timetype }}</label>
    <input @change="handleDateTimeChange" id="datetime" type="datetime-local" v-model="selectedDateTime"
      class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
  </div>
</template>
  
<script setup>
import { ref } from 'vue';

const selectedDateTime = ref('');
const props = defineProps({
  timetype: String
})

//create emits
const emit = defineEmits(['onTimeChange'])

// Function to handle changes in the selected date and time
const handleDateTimeChange = (event) => {
  selectedDateTime.value = event.target.value;
  emit('onTimeChange', selectedDateTime.value)
};
</script>
  