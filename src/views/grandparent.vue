<template>
    <parent :msg="message"></parent>
    <div v-html="htmlContent" ></div>
    <button @click="changeMsg">changeMsg</button>
</template>

<script setup>
import parent from './parent.vue'
import { ref } from 'vue'
const message = ref('hello')
const message2 = ref('hello2')
const changeMsg = () => {
    message.value += 'x'
}
const htmlContent = ref('<parent :msg="message2"></parent>')
</script>