<template>
    <!-- <div
        style="display: flex; flex-direction: column; align-items: center;background-color:rgb(217, 198, 222);min-height: 100vh; "> -->
    <!-- <div ref="fixedHeaderRef" id="fixed-header"
            style="position: fixed;top: 0; width: 100%;z-index:10; max-width:750px ;"> -->
    <header ref="header" class="site-header p-1">
        <div class="wrapper site-header__wrapper">
            <div class="site-header__start">
                <div class="menu-icon">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
                
                <a href="#" class="brand">{{ props.header }}</a>
            </div>

            <div class="site-header__end">
                <ExamTimer class="pr-1" :timer-start="props.contestStartTime" :timer-end="props.contestEndTime"></ExamTimer>
                <button style="color: #422d95;" class="submit-test-button" @click="showConfirmationModal">Go
                    Home</button>
            </div>
        </div>
    </header>
    

    <div class="answerinfo">
        <div style="display: flex;align-items: center;margin: 1px 4px;">
            <div style="background-color: lightseagreen; padding: 5px; margin:0 2px; border-radius: 1px;">{{
                props.totalAnswered }}</div>
            <div style="font-weight: light;font-size: small;">Answered</div>
        </div>
        <div style="display: flex;align-items: center;margin: 1px 4px;">
            <div style="background-color: red; padding: 5px;margin:0 2px;">{{ props.totalUnAnswered }}</div>
            <div style="font-weight: light;font-size: small;">Not Answered</div>
        </div>
    </div>

    <div class="cont">
        <h2> Q {{ props.index + 1 }} {{ qType[props.questionType] }} ({{ props.questionMarks }} marks)</h2>
    </div>
    <!-- </div> -->
    <!-- </div> -->
    <div class="modal" id="confirmModal">
                    <div class="modal-content" style="max-width: 500px;">
                        <hr>
                        <p>Ending Test will take you back to Home Page</p>
                        <!-- <p>Your Responses will be saved</p> -->
                        <p>You can still come back during exam window.</p>
                        <p>Are you sure you want to submit the test?</p>
                        <hr>
                        <div style="display: flex; justify-content: space-around;">
                            <button @click="submitTest">Yes</button>
                            <button @click="closeModal">No</button>
                        </div>
                    </div>
    </div>
</template>

<script setup>
import ExamTimer from './ExamTimer.vue';
import { qType } from '../../utility/GlobalData';
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps({
    totalAnswered: Number,
    totalUnAnswered: Number,
    header: String,
    answerStatus: Array,
    contestStartTime: Number,
    contestEndTime: Number,
    index: Number,
    questionType: String,
    questionMarks: Number
})

function showConfirmationModal() {
    document.getElementById('confirmModal').style.display = 'block';
}
async function submitTest() {
    // isLoading.value = true
    // // await updateScore({ contestName: props.contestName })
    // isLoading.value = false
    // closeModal(); // Close the modal after submission
    // if (props.showScore)
    //     router.push(`/${props.scoreLink}`)
    // else
    //     await router.push('/')
    // //reload
    // location.reload()
    await router.push('/')
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';

}

</script>

<style>
@import '../../assets/buttons.css';
@import '../../assets/modals.css';
@import '../../assets/header.css';
@import '../../assets/contestmenu.css';
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

[v-cloak] {
    display: none;
}

.cont {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #422d95;
    padding: 0px 10px;

}

.cont h2 {
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0px;
}

.answerinfo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* margin: 5px 0px; */
    background-color: #e3e3e3;
}

</style>