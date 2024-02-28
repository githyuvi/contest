<template>
    <div class="p-4">
        <!-- Fetch Users Section -->
        <div class="mb-4">
            <form @submit.prevent="fetchUsersWithAccess">
                <label for="examname" class="block">Enter exam name</label>
                <input v-model="examName" id="examname" type="text" class="border p-2">
                <button class="bg-blue-500 text-white py-2 px-4 rounded mt-2">
                    Enter
                </button>
            </form>
        </div>
        <div v-if="show">
        <!-- Users with Access Section -->
        <div class="mb-4">
            <div v-for="(user, index) in usersWithAccess" :key="user"
                class="flex items-center justify-between border p-2 mb-2">
                <span>{{ user }}</span>
                <button @click="() => removeUser(user, index)" class="bg-red-500 text-white py-1 px-2 rounded">
                    Remove
                </button>
            </div>
        </div>
        <!-- Add New Users-->
        <form @submit.prevent="() => {usersWithAccess.push(newUser); newUser = ''}">
            <div class="mb-4">
                <label for="newuser" class="block">Enter new user</label>
                <input v-model="newUser" id="newuser" type="text" class="border p-2">
                <button
                    class="bg-blue-500 text-white py-2 px-4 rounded mt-2">
                    Add
                </button>
            </div>
        </form>
        <button @click="addNewUsersAccess" class="bg-blue-500 text-white py-2 px-4 rounded mt-2">
            Save
        </button>
    </div>
        <div class="flex items-center justify-center h-screen">
            <Loading :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></Loading>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import Loading from 'vue-loading-overlay'
const BASE_URL = import.meta.env.VITE_BASE_URL || process.env.VUE_APP_BASE_URL
const AUTH = import.meta.env.VITE_AUTH || process.env.VUE_APP_AUTH
const examName = ref('')
const usersWithAccess = ref([])
const newUser = ref('')
const isLoading = ref(false)
const show = ref(false)

const fetchUsersWithAccess = async () => {
    usersWithAccess.value = []
    isLoading.value = true
    try {
        const accessData = await axios.get(`${BASE_URL}/contestaccess/${examName.value}.json?${AUTH}`)
        console.log('access data',accessData)
        if(accessData.data) usersWithAccess.value = accessData.data
        show.value = true
        isLoading.value = false
    } catch (error) {
        console.log('no contest found', error)
        show.value = true
        isLoading.value = false
    }
    
}

const removeUser = async (user, index) => {
    //remove the user from userWithAccess then upload it to database
    isLoading.value = true
    usersWithAccess.value.splice(index, 1)
    isLoading.value = false
}

const removeNewUser = (user, index) => {
    //remove the user from userWithAccess then upload it to database
    usersWithAccess.value.splice(index, 1)
}  

const addNewUsersAccess = async () => {
    //add newusers to userswithaccess and push it to the database
    isLoading.value = true
    const accessData = await axios.put(`${BASE_URL}/contestaccess/${examName.value}.json?${AUTH}`, usersWithAccess.value)
    await fetchUsersWithAccess()
    isLoading.value = false
}
</script>

<style lang="scss" scoped></style>