<template>
<header class="bg-gray-900 text-white py-4">
    <div class="container mx-auto flex justify-between items-center">
        <!-- header left -->
        <div class="flex items-center">
            <!-- Logo -->
            <div class="mr-10">
                <a href="#" class="text-xl font-bold">Vue</a>
                <a href="#" class="text-sm">Exams</a>
            </div>
            <!-- header center visible if screen width greater than 600px -->
            <div class="hidden md:flex flex-wrap gap-4">
                <div v-for="item,index in items" :key="index">
                    <router-link :to="`/${item.path}`"><div class="cursor-pointer bg-gray-700 pr-4 pl-4">{{item.name}}</div></router-link>
                </div>
                
            </div>
        </div>

        <!-- header right -->
        <div class="flex items-center">
            <div class="mr-4">
                <span v-if="isLoggedIn">Welcome, {{extractUsername(userEmail)}}</span>
            </div>
            <div>
                <!-- Login/Sign Out buttons -->
                <button v-if="!isLoggedIn" class="mr-2">
                    <router-link to="/login" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Login
                    </router-link>
                </button>
                <LogoutButton v-if="isLoggedIn"></LogoutButton>
            </div>
            <!-- menu button visible if screen width less than 600px -->
            <Menu></Menu>
        </div>
    </div>
</header>


</template>

<script setup>
import { onMounted, computed } from 'vue'
import LogoutButton from './CommonComponents/LogoutButton.vue';
import Menu from './CommonComponents/Menu.vue';
import { useStore } from 'vuex';

const store = useStore()
const isLoggedIn = computed(() => store.state.userId)
const userEmail = computed(() => store.state.userEmail)

const items = [
    {
        path:'register',
        name:'Register'
    },
    {
        path:'admin',
        name:'AdminDashBoard'
    } 
]

const extractUsername = (userEmail) => {
      // Extract username before "@" symbol
      const atIndex = userEmail.indexOf('@');
      if (atIndex !== -1) {
        return userEmail.substring(0, atIndex);
      } else {
        // Handle invalid email
        return '';
      }
}

onMounted(() => {
    console.log('Header mounted')
})    


</script>

<style lang="scss" scoped></style>