<template>
    <div class="instructions-modal" style="margin:0 auto;">
        <div class="instructions-modal-content">
            <div class="instructions-area">
                <div class="instructionsdiv">Instructions</div>
                <div>
                    <ul>
                        <li>For questions with 10 marks, write your answers with a dark pen on a white paper.</li>
                        <li>An external simple calculator may be used.</li>
                        <li>For Multiple Choice Questions: -1 for wrong answer</li>
                        <li>No Negative Marking for Other Questions</li>
                        <li>Unattempted Answer: Zero Marks</li>

                    </ul>
                    <br>
                    <ul>
                        <li>Click on Save & Next to save your answers</li>
                        <li>Click on Clear to clear your answers</li>
                        <li>Click on Right Icon to go to next question</li>
                        <li>Click on Left Icon to go to previous question</li>
                    </ul>
                </div>
                <!-- <p>For further assistance, please contact us.</p> -->
            </div>
            <button class="close-instructions" style="padding: 20px ;" @click="closeInstructionModal">CLOSE</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    open: Boolean
})

const emits = defineEmits(['closeInstructionModal'])

function closeInstructionModal() {
    emits('closeInstructionModal')
}


</script>

<style scoped>
@import '../../assets/modals.css';

</style>