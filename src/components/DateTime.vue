<template>
    <div>
      <label for="datetime">{{timetype}}:</label>
      <input @change="handleDateTimeChange" id="datetime" type="datetime-local" v-model="selectedDateTime">
      
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
  