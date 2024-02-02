<template>
    <div class="loading-container">
        <header></header>
        <h1>Test starts in</h1>
        <h2>{{ hours }}h: {{ minutes }}m:{{ seconds }}s</h2>
        <button @click="() => router.push('/').then(() => window.location.reload())">Go Home</button>
    </div>
</template>

<script setup>
import { onBeforeMount,ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    submissionType: String,
    startTime: Number,
    offlineStartTime: Number
})

const emits = defineEmits(['timerOver'])
const router = useRouter()

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

onBeforeMount(async () => {
    const timer = setInterval(() => {
        const now = new Date().getTime();
        if (props.submissionType == 'Live')
            var distance = props.startTime - now;
        else if (props.submissionType == 'Offline')
            var distance = props.offlineStartTime - now;

        hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds.value = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance <= 0) {
            emits('timerOver')
            clearInterval(timer);
        }
    }, 1000);
})

</script>

<style scoped>
.loading-container {
    background-image: url('/loading_background.jpeg');
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}

h1 {
    font-size: 24px;
    color: rgb(0, 66, 116);
    background-color: aliceblue;
    padding: 2px 4px;
    border-radius: 2px;
    margin: 2px;
}

h2 {
    color: rgb(169, 169, 169);
    margin: 1px;
    background-color: white;
    padding: 2px 4px;
    color: #422d95;
}

.loading-container button {
    padding: 10px 20px;
    margin-top: 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid darkgreen;
    background-color: white;
    color: rgb(2, 58, 2);

}
</style>