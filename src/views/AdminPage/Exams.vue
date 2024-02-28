<template>
    <div :key="examsKey" class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300">
            <thead>
                <tr>
                    <th class="py-2 px-4 border-b border-r text-center">Name</th>
                    <th class="py-2 px-4 border-b border-r text-center">Date</th>
                    <th class="py-2 px-4 border-b border-r text-center">Status</th>
                    <th class="py-2 px-4 border-b border-r text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(exam, index) in exams" :key="exam.name+''+exam.status">
                    <td class="py-2 px-4 border-b border-r">{{ exam.name }}</td>
                    <td class="py-2 px-4 border-b border-r">{{ exam.date }}</td>
                    <td class="py-2 px-4 border-b border-r">{{ exam.status }}</td>
                    <td class="py-2 px-4 border-b">
                        <div class="flex space-x-2">
                            <button @click="() => handleActionButtonClick(exam.status, action, exam.name)" v-for="(action, actionIndex) in exam.buttons" :key="action"
                                class="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                                {{ action }}
                            </button>
                            
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div>
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></loading>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ExamCard from '../../components/CommonComponents/ExamCard.vue';
import Loading from 'vue-loading-overlay'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL || process.env.VUE_APP_BASE_URL
const AUTH = import.meta.env.VITE_AUTH || process.env.VUE_APP_AUTH
const isLoading = ref(false)
const examsKey = ref(0)

const examRepository = ref([])
const activeExams = ref([])
const archivedExams = ref([])
const exams = ref([])

async function fetchExamRepository() {
    isLoading.value = true
    examRepository.value = []
    const repData = await axios.get(`${BASE_URL}/livecontest.json?${AUTH}`)
    // make an array of keys
    if (repData.data == null) return
    const keys = Object.keys(repData.data)
    let arr = []
    for (let i = 0; i < keys.length; i++) {
        arr.push({
            name: keys[i],
            date: ''
        })
    }
    examRepository.value = arr
    isLoading.value = false
}

async function fetchActiveExams() {
    isLoading.value = true
    activeExams.value = []
    const repData = await axios.get(`${BASE_URL}/livecontestwindow.json?${AUTH}`)
    // make an array of keys
    var keys = []
    if(repData.data) keys = Object.keys(repData.data)
    let arr = []
    for (let i = 0; i < keys.length; i++) {

        let examDateStart = getReadableFromEpoch(repData.data[keys[i]].examwindow.starttime)
        let examDateEnd = getReadableFromEpoch(repData.data[keys[i]].examwindow.onlineendtime)
        let date = `${examDateStart.month} ${examDateStart.day}, ${examDateStart.hour12}${examDateStart.ampm} - ${examDateEnd.hour12}${examDateEnd.ampm}`
        arr.push({
            name: keys[i],
            date: date
        })
    }
    activeExams.value = arr
    isLoading.value = false
}

async function fetchArchivedExams() {
    // add delay
    isLoading.value = true
    archivedExams.value = []
    const repData = await axios.get(`${BASE_URL}/archivedcontest.json?${AUTH}`)
    // make an array of keys
    if (repData.data == null) return
    const keys = Object.keys(repData.data)
    let arr = []
    for (let i = 0; i < keys.length; i++) {
        arr.push({
            name: keys[i],
            date: ''
        })
    }
    archivedExams.value = arr
    isLoading.value = false
}

async function handleDelete(contestName, contestType) {
    const res = await axios.delete(`${BASE_URL}/${contestType}/${contestName}.json?${AUTH}`)
    console.log(res)
    if (contestType == 'livecontest')
        await fetchExamRepository()
    else if (contestType == 'archivedcontest')
        await fetchArchivedExams()
}

async function handleArchive(contestName) {
    
    console.log(contestName)
    //move from livecontest to archivedcontest
    const res = await axios.get(`${BASE_URL}/livecontest/${contestName}.json?${AUTH}`)
    console.log(res)
    const res2 = await axios.put(`${BASE_URL}/archivedcontest/${contestName}.json?${AUTH}`, res.data)
    console.log(res2)
    //delete from livecontest
    const res3 = await axios.delete(`${BASE_URL}/livecontest/${contestName}.json?${AUTH}`)
    await fetchExamRepository()
    await fetchArchivedExams()
}

async function handleEnd(contestName) {
    console.log(contestName)
    const res = await axios.delete(`${BASE_URL}/livecontestwindow/${contestName}.json?${AUTH}`)
    console.log(res)
    await fetchActiveExams()

}

async function handleExamRepositoryButtonClick(action, contestName) {
    if (action == 'Delete') {
        await handleDelete(contestName, 'livecontest')
    } else if (action == 'Move To Archive') {
        await handleArchive(contestName)
    }
    setExams()
}

async function handleActiveExamsButtonClick(action, contestName) {
    if (action == 'End') {
        const res = await axios.delete(`${BASE_URL}/livecontestwindow/${contestName}.json?${AUTH}`)
        await fetchActiveExams()
    } else if (action == 'Move To Archive') {
        await handleArchive(contestName)
        //remove from livecontestwindow
        const res = await axios.delete(`${BASE_URL}/livecontestwindow/${contestName}.json?${AUTH}`)
        await fetchActiveExams()
    }
    setExams()
}

async function handleArchivedExamsButtonClick(action, contestName) {
    if (action == 'Delete') {
        await handleDelete(contestName, 'archivedcontest')
    } else if (action == 'Move To Repository') {
        //move from archivedcontest to livecontest
        const res = await axios.get(`${BASE_URL}/archivedcontest/${contestName}.json?${AUTH}`)
        console.log(res)
        const res2 = await axios.put(`${BASE_URL}/livecontest/${contestName}.json?${AUTH}`, res.data)
        console.log(res2)
        //delete from archivedcontest
        const res3 = await axios.delete(`${BASE_URL}/archivedcontest/${contestName}.json?${AUTH}`)
        await fetchArchivedExams()
        await fetchExamRepository()
    }
    setExams()
}

async function handleActionButtonClick(status, action, contestName) {
    console.log(status, action, contestName)
    if(status == 'Active'){
        await handleActiveExamsButtonClick(action, contestName)
    }
    else if(status == 'In Repository'){
        await handleExamRepositoryButtonClick(action, contestName)
    }
    else if(status == 'Archived'){
        await handleArchivedExamsButtonClick(action, contestName)
    }
}

function getReadableFromEpoch(epoch) {
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


    return {
        date: date,
        year: year,
        month: monthmap[month],
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        hour12: hour12,
        ampm: ampm,
    }

}

function setExams() {
    examsKey.value++
    exams.value = []
    for (let i = 0; i < activeExams.value.length; i++) {
        exams.value.push({
            name: activeExams.value[i].name,
            date: activeExams.value[i].date,
            status: 'Active',
            buttons: ['End', 'Move To Archive']
        })
    }

    for (let i = 0; i < examRepository.value.length; i++) {
        let flag = false
        for (let j = 0; j < activeExams.value.length; j++) {
            if (examRepository.value[i].name == activeExams.value[j].name) {
                flag = true
                break
            }
        }
        if (flag) continue

        exams.value.push({
            name: examRepository.value[i].name,
            date: examRepository.value[i].date,
            status: 'In Repository',
            buttons: ['Delete', 'Move To Archive']
        })
    }

    for (let i = 0; i < archivedExams.value.length; i++) {
        exams.value.push({
            name: archivedExams.value[i].name,
            date: archivedExams.value[i].date,
            status: 'Archived',
            buttons: ['Delete', 'Move To Repository']
        })
    }
}


onMounted(async () => {
    isLoading.value = true
    await fetchExamRepository()
    await fetchActiveExams()
    await fetchArchivedExams()
    setExams()
    isLoading.value = false
})

</script>

<style scoped></style>