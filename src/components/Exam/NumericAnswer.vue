<script setup>
import { ref } from 'vue';
const props = defineProps({
    answerChosen: String
})
const emits = defineEmits(['onAnswerChange'])

const userAnswer = ref(props.answerChosen)

function handleAnswerChange(event) {
    userAnswer.value = event.target.value
    emits('onAnswerChange', userAnswer.value)

}


</script>

<template v-cloak>
    <div style="padding: 10px;">
        <div style="padding: 10px;">
            <label for="answer"> Answer </label>

            <input v-model="userAnswer" @input="(value) => handleAnswerChange(value)" type="number">
        </div>
    </div>
</template>

<style></style>


