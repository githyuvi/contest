<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')
const password = ref('')

const handleIsLoggedIn = () => {
    console.log("clicked")
    if (userName.value==="admin" && password.value==="123") {
        console.log("true")
        // isLoggedIn.value=true
        router.push('/democontestsubmit')
    }
}
</script>

<template>
    <div style="display: flex; align-items: center; flex-direction: column;">
        <form action="" @submit.prevent="handleIsLoggedIn" style="margin: 10px;">

            <div>
                <label for="username"> Username</label>
                <br>
                <input type="text" id="username" v-model="userName">

            </div>
            <div>
                <label for="password"> Password</label>
                <br>
                <input type="text" id="password" v-model="password">
            </div>

            <div style="margin: 10px 0px 0px 0px;">
                <button type="submit" style="font-size: 20px; border-radius: 5px;"> Login</button>
            </div>

        </form>
        <br>
        <div>
            <h3>
                Use the credentials below 
            </h3>
            <p> Username = admin<br>
                Password = 123
            </p>
        </div>
    </div>

</template>