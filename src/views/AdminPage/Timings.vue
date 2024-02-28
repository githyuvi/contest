<template>
    <div class="flex justify-center">
        <form @submit.prevent="updateContestTimings" class="max-w-md p-4 bg-white shadow-md rounded-md">
            <div class="mb-4">
                <button type="submit"
                    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
                    Set Time
                </button>
            </div>
            <div class="mb-4">
                <label for="contestName" class="block text-gray-600">Contest Name:</label>
                <input required type="text" id="contestName" v-model="contestNameForTimings"
                    class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            </div>
            <hr class="mb-4">
            <DateTime :timetype="'Start Time'" @onTimeChange="(value) => startTime = new Date(value).getTime()"></DateTime>
            <br class="mb-4">
            <DateTime :timetype="'Online End Time'" @onTimeChange="(value) => onlineEndTime = new Date(value).getTime()">
            </DateTime>
            <br class="mb-4">
            <DateTime :timetype="'Offline Start Time'"
                @onTimeChange="(value) => offlineStartTime = new Date(value).getTime()">
            </DateTime>
            <br class="mb-4">
            <DateTime :timetype="'Offline End Time'" @onTimeChange="(value) => offlineEndTime = new Date(value).getTime()">
            </DateTime>
            <br>
        </form>
    </div>
    <div>
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></loading>
    </div>
</template>

<script setup>
import Loading from 'vue-loading-overlay';
import DateTime from '../../components/CommonComponents/DateTime.vue';
import { ref } from 'vue'
import axios from 'axios'

const contestNameForTimings = ref('')
const BASE_URL = process.env.VUE_APP_BASE_URL = 'https://vueexam-15ff4-default-rtdb.firebaseio.com'
const AUTH = process.env.VUE_APP_AUTH = 'auth=tvkUOXCOI0Ol1BhiFEsD5CZjnofCTcuLXIvqquVl'
const isLoading = ref(false)
const startTime = ref(0)
const onlineEndTime = ref(0)
const offlineEndTime = ref(0)
const offlineStartTime = ref(0)

const updateContestTimings = async () => {
    isLoading.value = true
    try {
        const examWindow = {
            "starttime": startTime.value,
            "onlineendtime": onlineEndTime.value,
            "offlinestarttime": offlineStartTime.value,
            "offlineendtime": offlineEndTime.value
        }
        await axios.put(BASE_URL + '/livecontestwindow/' + contestNameForTimings.value + '/' + 'examwindow' + ".json?" + AUTH, examWindow)
        await axios.get(BASE_URL + '/.settings/rules.json?' + AUTH).then(async (result) => {

            const rulesData = result.data
            const string1 = 'GfVjoR7Cd8POBlbbgev7ZehM5XI3'
            const string2 = 'A6cqnRFjwth27cPIDCH1Tmuvzdi2'
            const cn = contestNameForTimings.value
            rulesData["rules"]["livecontestsubmission"][cn] = {
                "$user_id": {
                    "answers": {
                        ".read": `$user_id === auth.uid`,
                        ".write": `$user_id === auth.uid && ((${startTime.value} <= now && now <= ${onlineEndTime.value}) || (auth.uid == '${string1}' || auth.uid == '${string2}'))`
                    }
                }
            }

            rulesData["rules"]["offlinecontestsubmission"][cn] = {
                "$user_id": {
                    "answers": {
                        ".read": `$user_id === auth.uid`,
                        ".write": `$user_id === auth.uid && ((${offlineStartTime.value} <= now && now <= ${offlineEndTime.value}) || (auth.uid == '${string1}' || auth.uid == '${string2}'))`
                    }
                }
            }
            rulesData["rules"]["admincontestsubmission"][cn] = {
                "$user_id": {
                    "answers": {
                        ".read": `$user_id === auth.uid`,
                        ".write": `$user_id === auth.uid && ((${offlineStartTime.value} <= now && now <= ${offlineEndTime.value}) || (auth.uid == '${string1}' || auth.uid == '${string2}'))`
                    }
                }
            }
            


            await axios.put(BASE_URL + '/.settings/rules.json?' + AUTH, rulesData).then((result) => {
                console.log(result.data)
            })

        })
    } catch (error) {
        console.log('error' + error.message)
    }
    isLoading.value = false

}

</script>

<style lang="scss" scoped></style>