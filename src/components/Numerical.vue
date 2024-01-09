<script setup>
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref } from "vue";
import {
    getDatabase,
    ref as firebaseRef,
    set,
    get,
    child,
} from "firebase/database";
import { getQuestionData } from '../utility/getContentData';
import ContentView from './ContentView.vue';

import Loading from 'vue-loading-overlay';
const isLoading = ref(false)
const fullPage = ref(true)

const downloaded = ref(false)
const store = useStore();
const db = getDatabase();
const dbRef = firebaseRef(db);
const props = defineProps({
    question: Array,
    questionLocation: String,
    questionOrder: Number,
    contestType: String,
    contestName: String,
    submissionType: String,
})

const userId = computed(() => store.state.userId)
const questionParts = reactive([])
const questionData = computed(() => store.state.questionData)

defineExpose({

    async save() {
        try {
            if (answer.value == '')
                await set(child(dbRef, `${props.submissionType}contestsubmission/${props.contestName}/${userId.value}/answers/${props.questionLocation}/answer`), null)
            else
                await set(child(dbRef, `${props.submissionType}contestsubmission/${props.contestName}/${userId.value}/answers/${props.questionLocation}/answer`), answer.value)

            if (questionData.value[props.questionLocation] == null)
                questionData.value[props.questionLocation] = {}
            questionData.value[props.questionLocation].answer = answer.value
            store.commit('setQuestionData', questionData.value)
            if ((answer.value == '' || answer.value == [] || answer.value == null) && questionData.value["answerstatus"][props.questionLocation]) {
                questionData.value["answerstatus"][props.questionLocation] = false
                store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value - 1)
                store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value + 1)

            }
            else if (answer.value != '' && answer.value != [] && answer.value != null && !questionData.value["answerstatus"][props.questionLocation]) {
                questionData.value["answerstatus"][props.questionLocation] = true
                store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value + 1)
                store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value - 1)
            }
        } catch (error) {
            console.log(error)
            alert('could not submit')
        }
    },
    async clear() {
        answer.value = null
    }
})
const answer = ref(null)
onMounted(async () => {
    isLoading.value = true

    if (questionData.value[props.questionLocation] != null && questionData.value[props.questionLocation].questionParts != null) {
        questionParts.splice(0, questionParts.length)
        questionParts.push(...questionData.value[props.questionLocation].questionParts)
    } else {
        await getQuestionData(props, userId, questionParts)
        if (questionData.value[props.questionLocation] == null)
            questionData.value[props.questionLocation] = {}
        questionData.value[props.questionLocation].questionParts = questionParts
        store.commit('setQuestionData', questionData.value)
    }

    if (questionData.value[props.questionLocation] != null && questionData.value[props.questionLocation].answer != null) {
        answer.value = questionData.value[props.questionLocation].answer

    }
    else {
        const snapshot = await get(child(dbRef, props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + 'answers/' + props.questionLocation + '/answer'))
        if (snapshot.exists()) {
            answer.value = snapshot.val()
            if (questionData.value[props.questionLocation] == null)
                questionData.value[props.questionLocation] = {}
            questionData.value[props.questionLocation].answer = answer.value
            store.commit('setQuestionData', questionData.value)
            // console.log('numeric answer')
        }
    }
    downloaded.value = true
    isLoading.value = false
})


function handleAnswerChange(event) {
    answer.value = event.target.value
}

</script>

<template v-cloak>
    <div style="padding: 10px;" v-if="downloaded">
        <ContentView :key="props.questionLocation" :content-parts="questionParts"></ContentView>

        <div style="padding: 10px;">
            <label for="answer"> Answer </label>

            <input v-model="answer" @input="(value) => handleAnswerChange(value)" type="number">
        </div>
    </div>
    <!-- <div v-if="isLoading" style="position: absolute;display: flex;justify-content: center;align-items: center;height: 100%;width: 100%;">
        <Loading style="position: relative;" :active.sync="isLoading" :can-cancel="true" :is-full-page="false"></Loading>

    </div> -->
</template>

<style></style>


