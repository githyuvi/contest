<script setup>
import MultipleCorrectFull from './MultipleCorrectFull.vue';
import SingleCorrectFull from './SingleCorrectFull.vue';
import MultipleCorrectDescriptionFull from './MultipleCorrectDescriptionFull.vue';
import SingleCorrectDescriptionFull from './SingleCorrectDescriptionFull.vue';
import Descriptive from './Descriptive.vue';
import Numerical from './Numerical.vue'
import { ref, reactive, onMounted, computed } from 'vue';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import Loading from 'vue-loading-overlay';
import router from '../../router';
import { qType } from '../../utility/GlobalData.js'
import { getDatabase, get, ref as firebaseRef, child } from 'firebase/database';
import { useStore } from "vuex";
import { onBeforeRouteLeave } from 'vue-router';

const MAX_WIDTH_HEADER = 750
const MAX_WIDTH_CONTENT = 700

const isAdmin = ref(false)

const functions = getFunctions()
const checkContestAccess = httpsCallable(functions, "checkContestAccess")


// connectFunctionsEmulator(functions, "127.0.0.1", 5001);
const getContestQuestions = httpsCallable(functions, 'getContestQuestions')
const updateScore = httpsCallable(functions, 'updateScore')

const db = getDatabase();
const dbRef = firebaseRef(db);
const store = useStore()

const userId = computed(() => store.state.userId)
console.log(userId.value)
const questionDataGlobal = computed(() => store.state.questionData)

var questionObjects = []
const questionParts = reactive([])
const optionsArray = ref('')
const questionType = ref('')
const questionOrder = ref('')
const questionMarks = ref('')

const mcComponent = ref(null)
const scComponent = ref(null)
const numComponent = ref(null)
const mcdComponent = ref(null)
const scdComponent = ref(null)
const desComponent = ref(null)

const mckey = ref(0)
const sckey = ref(0)
const numkey = ref(0)
const mcdkey = ref(0)
const scdkey = ref(0)
const deskey = ref(0)
const questionContentKey = ref(0)

var index = -1
const downloaded = ref(false)
const header = ref(null)

const isLoading = ref(false)
const fullPage = ref(true)

const questionContentMargin = ref(0)
const questionContentStyle = ref({})
const fixedHeaderRef = ref(null)

const onlineEndTime = ref(0)
const startTime = ref(0)
const offlineStartTime = ref(0)
const offlineEndTime = ref(0)
const submissionType = ref('')

const props = defineProps({
    contestName: String,
    showScore: false,
    scoreLink: String,
    header: String
})

function showConfirmationModal() {
    document.getElementById('confirmModal').style.display = 'block';
}

function showInstructionModal() {
    document.querySelector('.instructions-modal').style.display = 'flex';
    document.querySelector('.menu').style.display = 'none'
}

function closeInstructionModal() {
    document.querySelector('.instructions-modal').style.display = 'none';
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';

}

function changeQuestion(i) {
    index = i - 1
    next()
    //close menu
    document.querySelector('.menu').style.display = 'none'
}

// Function to submit the test
async function submitTest() {
    isLoading.value = true
    // await updateScore({ contestName: props.contestName })
    isLoading.value = false
    closeModal(); // Close the modal after submission
    if (props.showScore)
        router.push(`/${props.scoreLink}`)
    else
        await router.push('/')
    //reload
    location.reload()

}
const next = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    isLoading.value = true;
    index++
    if (index <= -1) {
        index = questionObjects.length - 1
    }
    if (index >= questionObjects.length) {
        index = 0
    }
    questionType.value = questionObjects[index].questionType
    if (questionType.value != 'des' && questionType.value != 'num') {
        questionType.value = questionObjects[index].questionType
        questionParts.value = questionObjects[index].questionParts
        optionsArray.value = questionObjects[index].optionsArray
        questionOrder.value = questionObjects[index].qNum
        questionMarks.value = questionObjects[index].questionMarks
    }
    else if (questionType.value == 'num') {
        questionType.value = questionObjects[index].questionType
        questionParts.value = questionObjects[index].questionParts
        questionOrder.value = questionObjects[index]["qNum"]
        questionMarks.value = questionObjects[index].questionMarks
    }
    else {
        questionType.value = questionObjects[index].questionType
        questionParts.value = questionObjects[index].questionParts
        questionOrder.value = questionObjects[index]["qNum"]
        questionMarks.value = questionObjects[index].questionMarks
    }
    if (questionType.value == 'mc')
        mckey.value = index + 2
    if (questionType.value == 'sc')
        sckey.value = index + 2
    if (questionType.value == 'mcd')
        mcdkey.value = index + 2
    if (questionType.value == 'scd')
        scdkey.value = index + 2
    if (questionType.value == 'des')
        deskey.value = index + 2
    if (questionType.value == 'num')
        numkey.value = index + 2
    // questionContentKey.value++
    isLoading.value = false

}


const save = async () => {
    isLoading.value = true
    if (questionType.value == 'mc') {
        await mcComponent.value.save()

    } else if (questionType.value == 'sc') {
        await scComponent.value.save()

    } else if (questionType.value == 'mcd') {
        await mcdComponent.value.save()

    } else if (questionType.value == 'scd') {
        await scdComponent.value.save()

    } else if (questionType.value == 'des') {
        await desComponent.value.save()

    } else if (questionType.value == 'num') {
        await numComponent.value.save()

    }



    next()
    isLoading.value = false
}

const clear = () => {
    if (questionType.value == 'mc') {
        mcComponent.value.clear()

    } else if (questionType.value == 'sc') {
        scComponent.value.clear()

    } else if (questionType.value == 'mcd') {
        mcdComponent.value.clear()

    } else if (questionType.value == 'scd') {
        scdComponent.value.clear()

    } else if (questionType.value == 'des') {
        desComponent.value.clear()

    }
    else if (questionType.value == 'num') {
        numComponent.value.clear()

    }
}

const previous = () => {
    index -= 2
    next()
}
onMounted(async () => {
    // check if user is admin
    const result = await checkContestAccess({ contestName: props.contestName })
    isAdmin.value = result.data

    isLoading.value = true

    // get online end time
    const snapshot = await get(child(dbRef, "livecontestwindow/" + props.contestName + "/" + "examwindow/"))
    const examWindow = snapshot.val()
    startTime.value = examWindow.starttime
    onlineEndTime.value = examWindow.onlineendtime
    offlineStartTime.value = examWindow.offlinestarttime
    offlineEndTime.value = examWindow.offlineendtime
    // startTime.value = 1704312480000
    // onlineEndTime.value = 1704312600000
    // offlineEndTime.value = 1704312660000

    // get submission type
    const ct = new Date().getTime()
    if (startTime.value <= ct && ct <= onlineEndTime.value)
        submissionType.value = 'live'
    else if (onlineEndTime.value < ct && ct <= offlineStartTime.value)
        submissionType.value = 'offline window will open soon'
    else if (offlineStartTime.value <= ct && ct <= offlineEndTime.value)
        submissionType.value = 'offline'
    else if (isAdmin.value) {
        submissionType.value = 'offline'
    }
    else
        submissionType.value = 'over'

    console.log('submission type', submissionType.value)

    // run a timer and do something after it gets over
    var x = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();
        var distance;
        // Find the distance between now and the count down date
        if (submissionType.value == 'live') {

            distance = onlineEndTime.value - now;
        }
        else if (submissionType.value == 'offline') {
            distance = offlineEndTime.value - now;

        }
        else {

            distance = -1;
        }

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display the result in the element with id="timer"
        document.getElementById("timer").innerHTML = hours + "h " +
            minutes + "m " + seconds + "s ";
        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "EXPIRED";
            // alert('Your time is up. You will be redirected to home page.')

            if (isAdmin.value) {
                console.log('')
            }
            else {
                //openEndingExamModal
                const endingExamModal = document.querySelector('.ending-exam-modal')
                endingExamModal.style.display = 'flex'
                // time interval of 2s
                setTimeout(() => {
                    //closeEndingExamModal
                    endingExamModal.style.display = 'none'
                    router.push('/').then(() => { window.location.reload() })
                }, 2000);
            }



        }
    }, 1000);

    await getContestQuestions({ contestName: props.contestName, contestType: "livecontest" }).then(async (result) => {

        let questionData = result.data
        let questionTypeMap = {}
        for (let i = 0; i < questionData.length; i++) {

            let q = questionData[i]
            if (questionTypeMap[q.questionType] == null) {
                questionTypeMap[q.questionType] = [i]
            }
            else {
                questionTypeMap[q.questionType].push(i)
            }

        }
        if (questionTypeMap["sc"] != null) {
            questionTypeMap["sc"].forEach(qNum => {
                questionData[qNum]["qNum"] = qNum + 1
                questionObjects.push(questionData[qNum])
            })
        }
        if (questionTypeMap["mc"] != null) {
            questionTypeMap["mc"].forEach(qNum => {
                questionData[qNum]["qNum"] = qNum + 1
                questionObjects.push(questionData[qNum])
            })
        }
        if (questionTypeMap["num"] != null) {
            questionTypeMap["num"].forEach(qNum => {
                questionData[qNum]["qNum"] = qNum + 1
                questionObjects.push(questionData[qNum])
            })
        }
        if (questionTypeMap["scd"] != null) {
            questionTypeMap["scd"].forEach(qNum => {
                questionData[qNum]["qNum"] = qNum + 1
                questionObjects.push(questionData[qNum])
            })
        }
        if (questionTypeMap["mcd"] != null) {
            questionTypeMap["mcd"].forEach(qNum => {
                questionData[qNum]["qNum"] = qNum + 1
                questionObjects.push(questionData[qNum])
            })
        }
        if (questionTypeMap["des"] != null) {
            questionTypeMap["des"].forEach(qNum => {
                questionData[qNum]["qNum"] = qNum + 1
                questionObjects.push(questionData[qNum])
            })
        }
        // get user answers using firebase database
        const snapshot = await get(child(dbRef, submissionType.value + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/"))
        const userAnswers = snapshot.val()
        questionDataGlobal.value["answerstatus"] = {}

        for (let i = 0; i < questionObjects.length; i++) {
            const q = questionObjects[i]
            if (userAnswers != null && userAnswers['q' + q.qNum] != null) {
                questionDataGlobal.value["answerstatus"]['q' + q.qNum] = true
                store.commit('setTotalAnswered', computed(() => store.state.totalAnswered).value + 1)
            }
            else {
                questionDataGlobal.value["answerstatus"]['q' + q.qNum] = false
                store.commit('setTotalUnAnswered', computed(() => store.state.totalUnAnswered).value + 1)
            }
        }

        store.commit('setQuestionData', questionDataGlobal.value)

        next()


        // questionContentKey.value++
        downloaded.value = true
        questionContentStyle.value = {

            marginTop: fixedHeaderRef.value.clientHeight + 'px',
            // paddingTop:fixedHeaderRef.value.clientHeight
        }
        // console.log('height', fixedHeaderRef.value.clientHeight)
        isLoading.value = false
    }).catch((e) => {
        console.log(e)
    })


    // menu 
    const menuIcon = document.querySelector('.menu-icon');
    const menu = document.querySelector('.menu');
    const sidemenu = document.querySelector('.side-menu');
    // console.log('height', header.value.clientHeight)
    menu.style.marginTop = header.value.clientHeight + 'px'
    sidemenu.style.marginTop = fixedHeaderRef.value.clientHeight + 'px'
    if (window.innerWidth <= 600) {
        menuIcon.style.display = 'block';
        menu.style.display = 'none';
        sidemenu.style.display = 'none'
    }
    else {
        menuIcon.style.display = 'none';
        sidemenu.style.display = 'block'
    }

    menuIcon.addEventListener('click', () => {
        if (menu.style.display == 'none') {
            menu.style.display = 'block';
            // document.querySelector('#contest-content').style.overflow = 'hidden'
        }
        else {
            menu.style.display = 'none';
            // document.querySelector('#contest-content').style.overflow = 'auto'
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth <= 600) {
            menuIcon.style.display = 'block';
            menu.style.display = 'none';
            sidemenu.style.display = 'none'
        }
        else {
            menuIcon.style.display = 'none';
            sidemenu.style.display = 'block'
        }
    });


})



</script>

<template>
    <div
        style="display: flex; flex-direction: column; align-items: center;background-color:rgb(217, 198, 222);min-height: 100vh; ">
        <div ref="fixedHeaderRef" id="fixed-header"
            style="position: fixed;top: 0; width: 100%;z-index:10; max-width:750px ;">
            <header ref="header" class="site-header">
                <div class="wrapper site-header__wrapper">
                    <div class="site-header__start">
                        <div class="menu-icon">
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>
                        <div class="menu">
                            <div class="menu-content">
                                <div @click="showInstructionModal"
                                    style="width: fit-content;font-size: 0.6rem; font-weight: bold;color: #422d95;cursor: pointer;padding: 12px;"
                                    class="menu-item">
                                    INSTRUCTIONS</div>
                                <div class="menu-item">
                                    <div style="display: flex;align-items: center;margin: 1px 4px;">
                                        <div
                                            style="background-color: lightseagreen; padding: 11px 9px; margin:0 2px; border-radius: 1px;">
                                        </div>
                                        <div style="font-weight: light;color: gray;">Answered</div>
                                    </div>
                                    <div style="display: flex;align-items: center;margin: 1px 4px;">
                                        <div style="background-color: red; padding: 11px 9px;margin:0 2px;"></div>
                                        <div style="font-weight: light;color: gray;">Not Answered</div>
                                    </div>
                                </div>
                                <div class="menu-item">
                                    <div style="color: black;cursor: pointer; padding-bottom: 30px;"
                                        v-for="answerStatus, index, i in questionDataGlobal['answerstatus']" :key="index">
                                        <div @click="(() => changeQuestion(i))" v-if="answerStatus"
                                            style="background-color: lightseagreen; padding: 11px 9px; margin: 11px; border-radius: 1px;">
                                            {{ index.toUpperCase() }}
                                        </div>

                                        <div @click="() => changeQuestion(i)" v-if="!answerStatus"
                                            style="background-color: red; padding: 11px 9px; margin: 11px; border-radius: 1px;">
                                            {{ index.toUpperCase() }}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>


                        <a href="#" class="brand">{{ $props.header }}</a>

                    </div>

                    <div class="site-header__end">
                        <span class="timer">
                            <p>

                                <span id="timer">
                                    00:00:00
                                </span>
                            </p>
                        </span>
                        <button style="color: #422d95;" class="submit-test-button" @click="showConfirmationModal">SUBMIT
                            TEST</button>
                    </div>
                </div>
            </header>

            <div class="answerinfo">
                <div style="display: flex;align-items: center;margin: 1px 4px;">
                    <div style="background-color: lightseagreen; padding: 5px; margin:0 2px; border-radius: 1px;">{{
                        computed(() => store.state.totalAnswered) }}</div>
                    <div style="font-weight: light;font-size: small;">Answered</div>
                </div>
                <div style="display: flex;align-items: center;margin: 1px 4px;">
                    <div style="background-color: red; padding: 5px;margin:0 2px;">{{ computed(() =>
                        store.state.totalUnAnswered) }}</div>
                    <div style="font-weight: light;font-size: small;">Not Answered</div>
                </div>



            </div>

            <div class="cont">
                <h2> Q {{ index + 1 }} {{ qType[questionType] }} ({{ questionMarks }} marks)</h2>
            </div>
        </div>

        <div style="background-color:white;display: flex;max-width: 745px; justify-content: space-between; border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);min-height: 100vh; padding: 20px 0px 120px 10px;">
            <div :key="questionContentKey" :style="questionContentStyle" id="contest-content" class="contestcontent"
                v-if="downloaded">

                <div class="questionbox">

                    <MultipleCorrectFull :key="mckey" ref="mcComponent" v-if="questionType == 'mc'"
                        :question-location="'q' + questionOrder" :question-order="questionOrder" :question="questionParts"
                        :answers="optionsArray" contest-type="livecontest" :contest-name="contestName"
                        :submission-type="submissionType">
                    </MultipleCorrectFull>

                </div>

                <div class="questionbox">
                    <SingleCorrectFull :key="sckey" ref="scComponent" v-if="questionType == 'sc'"
                        :question-location="'q' + questionOrder" :question-order="questionOrder" :question="questionParts"
                        :answers="optionsArray" contest-type="livecontest" :contest-name="contestName"
                        :submission-type="submissionType"></SingleCorrectFull>
                </div>

                <div class="questionbox">
                    <Numerical :key="numkey" ref="numComponent" v-if="questionType == 'num'"
                        :question-location="'q' + questionOrder" :question-order="questionOrder" :question="questionParts"
                        contest-type="livecontest" :contest-name="contestName" :submission-type="submissionType">
                    </Numerical>

                </div>

                <div class="questionbox">
                    <MultipleCorrectDescriptionFull :key="mcdkey" ref="mcdComponent" v-if="questionType == 'mcd'"
                        :question-location="'q' + questionOrder" :questionOrder="questionOrder" :question="questionParts"
                        :answers="optionsArray" contestType="livecontest" :contest-name="contestName"
                        :submission-type="submissionType">
                    </MultipleCorrectDescriptionFull>
                </div>

                <div class="questionbox">
                    <SingleCorrectDescriptionFull :key="mcdkey" ref="scdComponent" v-if="questionType == 'scd'"
                        :question-location="'q' + questionOrder" :questionOrder="questionOrder" :question="questionParts"
                        :answers="optionsArray" contestType="livecontest" :contest-name="contestName"
                        :submission-type="submissionType">
                    </SingleCorrectDescriptionFull>
                </div>

                <div class="questionbox">
                    <Descriptive :key="deskey" ref="desComponent" v-if="questionType == 'des'"
                        :question-location="'q' + questionOrder" :question-order="questionOrder" :question="questionParts"
                        contest-type="livecontest" :contest-name="contestName" :submission-type="submissionType">
                    </Descriptive>
                </div>

                <!-- <div style="margin: 7vh; "></div> -->

                <div class="button-container">
                    <button @click="previous"><i class="fas fa-chevron-left"></i></button>
                    <button @click="next"><i class="fas fa-chevron-right"></i></button>
                    <button class="clear" @click="clear">Clear</button>
                    <button @click="save">Save & Next</button>

                </div>

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

            </div>

            <div class="side-menu">
                <div class="menu-content">
                    <div @click="showInstructionModal"
                        style="width: fit-content; cursor:pointer; font-size: 0.7rem; font-weight: bold;color: #422d95; padding:15px;"
                        class="menu-item">
                        INSTRUCTIONS</div>

                    <div class="menu-item">
                        <div style="display: flex;align-items: center;margin: 1px 4px;">
                            <div
                                style="background-color: lightseagreen; padding: 11px 9px; margin:0 2px; border-radius: 1px;">
                            </div>
                            <div style="font-weight: light;color: gray;">Answered</div>
                        </div>
                        <div style="display: flex;align-items: center;margin: 1px 4px;">
                            <div style="background-color: red; padding: 11px 9px;margin:0 2px;"></div>
                            <div style="font-weight: light;color: gray;">Not Answered</div>
                        </div>
                    </div>
                    <div class="menu-item">
                        <div style="color: black;cursor: pointer;"
                            v-for="answerStatus, index, i in questionDataGlobal['answerstatus']" :key="index">
                            <div @click="(() => changeQuestion(i))" v-if="answerStatus"
                                style="background-color: lightseagreen; padding: 11px 9px; margin: 11px; border-radius: 1px;">
                                {{ index.toUpperCase() }}
                            </div>

                            <div @click="() => changeQuestion(i)" v-if="!answerStatus"
                                style="background-color: red; padding: 11px 9px; margin: 11px; border-radius: 1px;">
                                {{ index.toUpperCase() }}
                            </div>



                        </div>

                    </div>

                </div>
            </div>

        </div>
    </div>
    <div class="instructions-modal">
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
    <div class="ending-exam-modal">
        <div class="ending-exam-content">
            <div class="instructions-area">
                <div class="instructionsdiv">Vue Exams</div>
                <!-- <ol>
                    <li>Step 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li>Step 2: Nulla facilisi. Fusce aliquam interdum eros, eget mollis lectus feugiat ac.</li>
                    <li>Step 3: Sed vitae tellus eu purus facilisis aliquet nec at velit.</li>
                    <li>Step 4: Integer dapibus dui vitae sapien eleifend, sit amet accumsan nulla consectetur.</li>
                    <li>Step 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>

                </ol> -->
                <!-- <p>For further assistance, please contact us.</p> -->
            </div>
            <div>Ending Exam ...</div>
            <div>Going to Home Page</div>

            <!-- <button class="close-instructions" @click="closeInstructionModal">CLOSE</button> -->
        </div>
    </div>
    <!-- <footer style="padding: 120px 0px;background-color:rgb(217, 198, 222)"></footer> -->
    <div class="vld-parent">
        <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>

    </div>
</template>


<style>
@import 'node_modules/vue-loading-overlay/dist/css/index.css';
@import '../assets/buttons.css';
@import '../assets/modals.css';
@import '../assets/header.css';
@import '../assets/contestmenu.css';
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

.questionbox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.timer {
    margin-right: 5px;
}

.answerinfo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* margin: 5px 0px; */
    background-color: #e3e3e3;
}

.contestbody {
    display: flex;
    flex-direction: column;
}

.contestcontent {
    /* flex: 1; */
    overflow-y: auto;
    padding-right: 10px;
    margin: 10px;
    /* border-right: 1px solid black; */
    /* border: 1px solid black; */
}

/* /* set border right of contest content if width is greater than 600px */
@media (min-width: 600px) {
    .contestcontent {
        border-right: 1px solid black;
    }
}

*/ .fixedposition {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
}</style>
