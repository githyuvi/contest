<template>
    <div style="margin: 0 auto;" class=" max-w-4xl">
        <div ref="examHeaderRef" class="fixed z-10 w-full max-w-4xl" style="">
            <ExamHeader
                :question-marks="props.questionsArray[props.index].questionMarks" :index="props.index"
                :question-type="props.questionsArray[props.index].questionType" :contest-start-time="props.contestStartTime"
                :contest-end-time="props.contestEndTime" style="max-width: 850px;" :header="header"
                :answer-status="answerStatus" :total-answered="totalAnswered" :total-un-answered="totalUnAnswered">
            </ExamHeader>
        </div>
        <div ref="topMenu" class="menu">
            <MenuContent @show-instruction-modal="() => examInstructionsVisible = true" @change-question="handleChangeQuestion" :answer-status="answerStatus"></MenuContent>
        </div>
        <div class="flex flex-row">
            <div ref="sideMenu" class="side-menu">
                <MenuContent @show-instruction-modal="() => examInstructionsVisible = true" @change-question="handleChangeQuestion" :answer-status="answerStatus"></MenuContent>
            </div>
            <div :style="style">
                <div v-if="props.questionsArray[props.index] != null">
                    <div class="p-5">
                        <QuestionStatement :content-parts="questionsArray[props.index].questionParts"></QuestionStatement>
                    </div>
                    <div :key="submissionArea">
                        <div class="p-5" v-if="questionsArray[props.index].questionType == 'sc'">

                            <SingleCorrectOptions
                                @get-option-selected="(value) => handleOptionOrAnswerChange(questionsArray[props.index].questionNumber, value)"
                                :options-array="questionsArray[props.index].optionsArray"
                                :option-chosen="userSubmissions ? userSubmissions.options : null">
                            </SingleCorrectOptions>
                        </div>

                        <div class="p-5" v-else-if="questionsArray[props.index].questionType == 'mc'">
                            <MultipleCorrectOptions
                                @get-options-selected="(value) => handleOptionOrAnswerChange(questionsArray[props.index].questionNumber, value)"
                                :options-array="questionsArray[props.index].optionsArray"
                                :options-chosen="userSubmissions ? userSubmissions.options : null">
                            </MultipleCorrectOptions>
                        </div>

                        <div class="p-5" v-else-if="questionsArray[props.index].questionType == 'num'">
                            <NumericAnswer :answer-chosen="userSubmissions ? userSubmissions.answer : null"
                                @on-answer-change="(value) => handleOptionOrAnswerChange(questionsArray[props.index].questionNumber, value)">
                            </NumericAnswer>
                        </div>

                        <div class="p-5" v-else-if="questionsArray[props.index].questionType == 'des'">
                            <DescriptiveAnswer :files-uploaded="userSubmissions ? userSubmissions : []"
                                @on-files-change="(value) => handleOptionOrAnswerChange(questionsArray[props.index].questionNumber, value)">
                            </DescriptiveAnswer>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <ExamInstructionsModal v-if="examInstructionsVisible" @close-instruction-modal="() => examInstructionsVisible = false"></ExamInstructionsModal>
    
</template>

<script setup>
import MultipleCorrectOptions from './MultipleCorrectOptions.vue'
import SingleCorrectOptions from './SingleCorrectOptions.vue'
import NumericAnswer from './NumericAnswer.vue'
import QuestionStatement from './QuestionStatement.vue'
import DescriptiveAnswer from './DescriptiveAnswer.vue';
import { ref, onBeforeMount, onMounted } from 'vue';
import ExamHeader from './ExamHeader.vue';
import MenuContent from './MenuContent.vue';
import { setMenuPosition } from '../../utility/Menu/menuposition';
import ExamInstructionsModal from './ExamInstructionsModal.vue';

const topMenu = ref(null)
const sideMenu = ref(null)
const examInstructionsVisible = ref(false)
const submissionArea = ref(0)

const props = defineProps({
    questionsArray: Array,
    index: Number,
    contestStartTime: Number,
    contestEndTime: Number,
    contestName: String
})
const examHeaderRef = ref(null)
const style = ref({})
const totalAnswered = ref(0)
const totalUnAnswered = ref(0)
const header = ref(props.contestName.charAt(0).toUpperCase() + props.contestName.slice(1))
const answerStatus = ref([])

const emits = defineEmits(['onUserResponseChange', 'onSave', 'changeQuestion', 'showInstructionModal'])
console.log('data', props.questionsArray)
console.log('index', props.index)
const userSubmissions = ref(props.questionsArray[props.index].submissions)

const handleOptionOrAnswerChange = (questionNumber, value) => {
    const questionType = props.questionsArray[props.index].questionType
    if (questionType == 'sc' || questionType == 'mc') {
        userSubmissions.value = { options: value }
    }
    else if (questionType == 'num') {
        userSubmissions.value = { answer: value }
    }
    else if (questionType == 'des') {
        userSubmissions.value = value
    }
    emits('onUserResponseChange', value)
}

const handleChangeQuestion = (index) => {
    emits('changeQuestion', index)
}

defineExpose({
    clear() {
        console.log('clicked clear');
        const qType = props.questionsArray[props.index].questionType
        console.log('qType', qType);
        if (qType == 'des')
            userSubmissions.value = []
        else
            userSubmissions.value = null
        submissionArea.value++
    }

})

onBeforeMount(() => {
    for (let i = 0; i < props.questionsArray.length; i++) {
        let submission = props.questionsArray[i].submissions
        console.log('submission', submission);
        if (submission == null || submission.length == 0) {
            totalUnAnswered.value++
            answerStatus.value.push(false)
        }
        else {
            totalAnswered.value++
            answerStatus.value.push(true)
        }
    }
})

onMounted(() => {
    style.value = {
        paddingTop: examHeaderRef.value.clientHeight + 'px'
    }
    window.addEventListener('resize', () => {
        style.value = {
            paddingTop: examHeaderRef.value.clientHeight + 'px'
        }
    })
    setMenuPosition()
    topMenu.value.style.marginTop = examHeaderRef.value.clientHeight + 'px'
    sideMenu.value.style.marginTop = examHeaderRef.value.clientHeight + 'px'

})
</script>

<style scoped></style>