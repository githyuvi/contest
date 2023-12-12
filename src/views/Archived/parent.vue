<template>
<Child :msg="msg"></Child>
</template>

<script setup>
import { ref } from 'vue'
// import child from './child.vue'
import Child from './child.vue';

defineProps(['msg'])

</script>