<template>
    <span class="timer">
        <p>

            <span id="timer">
                00:00:00
            </span>
        </p>
    </span>
</template>

<script setup>
import { onBeforeMount } from 'vue';
const props = defineProps({
    timerStart: Number,
    timerEnd: Number
})

onBeforeMount(() => {
    var x = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();
        var distance;
        // Find the distance between now and the count down date
        if (now >= props.timerStart && now <= props.timerEnd) {
            distance = props.timerEnd - now
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
            console.log('timerOver');
            // alert('Your time is up. You will be redirected to home page.')

            // if (isAdmin.value) {
            //     console.log('')
            // }
            // else {
            //     //openEndingExamModal
            //     const endingExamModal = document.querySelector('.ending-exam-modal')
            //     endingExamModal.style.display = 'flex'
            //     // time interval of 2s
            //     setTimeout(() => {
            //         //closeEndingExamModal
            //         endingExamModal.style.display = 'none'
            //         router.push('/').then(() => { window.location.reload() })
            //     }, 2000);
            // }

        }
    }, 1000);
})

</script>

<style scoped></style>