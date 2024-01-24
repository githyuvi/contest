<template>
    <div class="flex flex-wrap justify-center">
        <div v-for="exam in exams" class="bg-white p-4 m-4 rounded-md shadow-md">
            <span class="text-base font-semibold">{{ exam.name }} </span>
            <span>&nbsp{{ exam.date }}</span>
            <div class="mt-2 flex space-x-2">
                <button @click="() => handleButtonClick(butName,exam.name)" v-for="butName,i in props.buttons" :key="i" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300">{{ butName }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    exams: Array,
    buttons: Array
})
const emits = defineEmits(['onButtonClick'])
function handleButtonClick(butName, contestName){
    emits('onButtonClick', butName, contestName)
}

</script>

<style scoped>

</style>