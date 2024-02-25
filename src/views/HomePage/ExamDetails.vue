<script setup>
import { computed, onMounted, ref } from 'vue';
import { getDatabase, ref as firebaseRef, get, child, off } from "firebase/database";
import { useStore } from 'vuex';
const startTime = ref(0)
const onlineEndTime = ref(0)
const offlineEndTime = ref(0)
const offlineStartTime = ref(0)
const submissionType = ref('')
const store = useStore()
const isRegistered = computed(()=>store.state.isRegistered)
const isLoggedIn = computed(() => store.state.isLoggedIn)
console.log(isRegistered.value)
console.log(computed(()=>store.state.userId))

const db = getDatabase();
const dbRef = firebaseRef(db);
const downloaded = ref(false)
const sublink = ref('')

const props = defineProps({
    contestName: String,
    contestType: String
})

onMounted(async () => {
    if(props.contestType == 'livecontest')
        sublink.value = 'exam'
    else
        sublink.value = 'archivedexam'
    if(props.contestType == 'archivedcontest'){
        downloaded.value = true
        return
    }
    else {
    const snapshot = await get(child(dbRef, "livecontestwindow/" + props.contestName + "/" + "examwindow/"))
    const examWindow = snapshot.val()

    startTime.value = examWindow.starttime
    onlineEndTime.value = examWindow.onlineendtime
    offlineEndTime.value = examWindow.offlineendtime
    offlineStartTime.value = examWindow.offlinestarttime

    const ct = new Date().getTime()
        if (startTime.value <= ct && ct <= onlineEndTime.value)
            submissionType.value = 'live'
        else if (onlineEndTime.value < ct && ct <= offlineEndTime.value)
            submissionType.value = 'offline'
        else if (ct < startTime.value)
            submissionType.value = 'Not Yet Started'
        else
            submissionType.value = 'Over'

    const timer2 = setInterval(() => {
        const ct = new Date().getTime()
        if (startTime.value <= ct && ct <= onlineEndTime.value)
            submissionType.value = 'live'
        else if (onlineEndTime.value < ct && ct <= offlineEndTime.value)
            submissionType.value = 'offline'
        else if (ct < startTime.value)
            submissionType.value = 'Not Yet Started'
        else
            submissionType.value = 'Over'

        if(submissionType.value == 'Over'){
            clearInterval(timer2)
        }
    }, 30000)

    downloaded.value = true
}

})

function convertEpochToReadable(epoch){
    let monthmap = {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'Jun',
        6: 'Jul',
        7: 'Aug',
        8: 'Sep',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec',
    }
    const date = new Date(epoch)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    //convert 24 years format to 12 hours format
    const hour12 = hour > 12 ? hour - 12 : hour
    const ampm = hour > 12 ? 'PM' : 'AM'

    
    return ` ${monthmap[month]} ${day}, ${year}, ${hour12}:${minute}:${second} ${ampm}`

}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

</script>

<template>
    
    <div v-if="downloaded">
        <div style="text-align: center;">
            <div class="contest-list">
                <div class="contest-section">
                    <div class="contest">
                        <div v-if="props.contestType=='archivedcontest'" class="title"> {{capitalizeFirstLetter(props.contestName)}}</div>
                        <div v-else class="title"> {{capitalizeFirstLetter(props.contestName)}}{{ submissionType == 'Not Yet Started' ? '':'(' + submissionType+ ')' }}</div>
                        <div v-if="props.contestType=='archivedcontest'" class="title"><button><router-link :to="`/${sublink}/${props.contestName}`">View</router-link></button></div>
                        <div v-else class="title"><button><router-link :to="`/${sublink}/${props.contestName}`">{{ isLoggedIn ?(isRegistered?'Start':'Register') : 'Login'}} </router-link></button></div>
                        <hr style="background-color: greenyellow;height: 5px;">
                        
                        <div v-if="props.contestType != 'archivedcontest'" class="description">
                            <div style="text-align: left;"><b>Live window:</b>{{ convertEpochToReadable(startTime) }}  - {{ convertEpochToReadable(onlineEndTime) }}</div>
                            <hr style="height: 1px;background-color: black;">
                            <div style="text-align: left;"><b>Offline window:</b> {{ convertEpochToReadable(offlineStartTime) }} - {{ convertEpochToReadable(offlineEndTime) }}</div>
                        </div>
                        <hr>
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
    background-color: #f5f5f5;
}

h1 {
    text-align: center;
}

.contest-list {
    margin-top: 10px;
    /* height: 100vh; */
    /* background-color: #fafafa; */
}

.contest-section {
    margin-bottom: 5px;
}

.contest-section h2 {
    margin-bottom: 10px;
}

.contest {
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    /* min-height: 100vh; */
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