<script setup>
import { onMounted, ref } from 'vue';

import { getDatabase, ref as firebaseRef, get, child, off } from "firebase/database";
const startTime = ref(0)
const onlineEndTime = ref(0)
const offlineEndTime = ref(0)
const submissionType = ref('')

const db = getDatabase();
const dbRef = firebaseRef(db);
const downloaded = ref(false)

onMounted(async () => {
    const snapshot = await get(child(dbRef, "livecontestwindow/" + "mock" + "/" + "examwindow/"))
    const examWindow = snapshot.val()

    startTime.value = examWindow.starttime
    onlineEndTime.value = examWindow.onlineendtime
    offlineEndTime.value = examWindow.offlineendtime

    // startTime.value = 1704314220000
    // onlineEndTime.value = 1704314280000
    // offlineEndTime.value = 1704314340000

    const ct = new Date().getTime()
        if (startTime.value <= ct && ct <= onlineEndTime.value)
            submissionType.value = 'live'
        else if (onlineEndTime.value < ct && ct <= offlineEndTime.value)
            submissionType.value = 'offline'
        else if (ct < startTime.value)
            submissionType.value = 'Not Yet Started'
        else
            submissionType.value = 'Ended'

    const timer2 = setInterval(() => {
        const ct = new Date().getTime()
        if (startTime.value <= ct && ct <= onlineEndTime.value)
            submissionType.value = 'live'
        else if (onlineEndTime.value < ct && ct <= offlineEndTime.value)
            submissionType.value = 'offline'
        else if (ct < startTime.value)
            submissionType.value = 'Not Yet Started'
        else
            submissionType.value = 'Ended'

        if(submissionType.value == 'Ended'){
            clearInterval(timer2)
        }
    }, 30000)

    downloaded.value = true

})

</script>

<template>
    <div v-if="downloaded">
        <div style="text-align: center;">
            <div class="contest-list">
                <div class="contest-section">
                    <!-- <h2>Ongoing Contests</h2> -->
                    <div class="contest">
                        <div class="title"> MOCK TEST 1 2024{{ submissionType == 'Not Yet Started' ? '':'(' + submissionType+ ')' }}</div>
                        <div class="title"><button><router-link to="/mockcontest"> {{ submissionType == 'Not Yet Started' ? 'Login':'Start' }}</router-link></button></div>
                        <hr style="background-color: greenyellow;height: 5px;">
                        <!-- <div class="title"> You need to <router-link to="/login"> <b>Login</b></router-link> and fill
                            <router-link to="/register"> <b>Register</b></router-link>
                            details to enter contest
                        </div>
                        <hr> -->
                        <div class="description">
                            <div style="text-align: left;"><b>Live window:</b> Jan 06, 2024, 02 PM - Jan 06, 2024, 05PM</div>
                            <hr style="height: 1px;background-color: black;">
                            <div style="text-align: left;"><b>Offline window:</b> Jan 06, 2024, 06 PM - Jan 07, 2024, 06 PM</div>
                        </div>
                        <hr>
                        <!-- <div class="date">Test will start on: Jan 04, 2024, 09 AM</div> -->
                    </div>

                </div>
            </div>


        </div>

    </div>


    <!-- <div>
        <ImagePreview></ImagePreview>
    </div> -->
</template>

<style scoped>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    text-align: center;
}

.contest-list {
    margin-top: 10px;
}

.contest-section {
    margin-bottom: 30px;
}

.contest-section h2 {
    margin-bottom: 10px;
}

.contest {
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
}

.contest .title {
    font-size: 18px;
    font-weight: bold;
}

.contest .description {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 15px;
    /* margin-top: 1px; */
}

.contest .date {
    font-size: 12px;
    margin-top: 5px;
}

.contest .title button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 24px;
    margin: 5px 0px;
    cursor: pointer;
    border-radius: 20px;
    width: 150px;
    height: 50px;
}

.contest .title button:hover {
    background-color: #3e8e41;
}</style>