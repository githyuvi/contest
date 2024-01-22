<template>
    <div class="menu-content">
        <div @click="showInstructionModal"
            style="width: fit-content; cursor:pointer; font-size: 0.7rem; font-weight: bold;color: #422d95; padding:15px;"
            class="menu-item">
            INSTRUCTIONS</div>

        <div class="menu-item">
            <div style="display: flex;align-items: center;margin: 1px 4px;">
                <div style="background-color: lightseagreen; padding: 11px 9px; margin:0 2px; border-radius: 1px;">
                </div>
                <div style="font-weight: light;color: gray;">Answered</div>
            </div>
            <div style="display: flex;align-items: center;margin: 1px 4px;">
                <div style="background-color: red; padding: 11px 9px;margin:0 2px;"></div>
                <div style="font-weight: light;color: gray;">Not Answered</div>
            </div>
        </div>
        <div class="menu-item">
            <div style="color: black;cursor: pointer; padding-bottom: 30px;" v-for="status, index in props.answerStatus"
                :key="index">
                <div @click="(() => changeQuestion(index))" v-if="status"
                    style="background-color: lightseagreen; padding: 11px 9px; margin: 11px; border-radius: 1px;">
                    Q{{ index + 1 }}
                </div>

                <div @click="() => changeQuestion(index)" v-if="!status"
                    style="background-color: red; padding: 11px 9px; margin: 11px; border-radius: 1px;">
                    Q{{ index + 1 }}
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    answerStatus: Array

})
const emits = defineEmits(['changeQuestion', 'showInstructionModal'])

function showInstructionModal() {
    emits('showInstructionModal')
    
}

function changeQuestion(index) {
    emits('changeQuestion', index)
    console.log('change question', index)
}

</script>

<style scoped>
@import '../../assets/contestmenu.css';
@import '../../assets/modals.css';
</style>