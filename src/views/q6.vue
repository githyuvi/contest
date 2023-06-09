<script setup>
    import SingleCorrectFull from '../components/SingleCorrectFull.vue';
    const answers1 = [
        '15 or less',
        '16 - 20',
        '21 - 25',
        '26 - 30',
        '31 - 40',
    ]

</script>

<template>
    <single-correct-full question-location="q1" question="what is matter" :answers="answers1" :buttons="['Previous', 'Save and Next']"  ></single-correct-full>
    
</template>