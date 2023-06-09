<script setup>
    import MultipleCorrectFull from '../components/MultipleCorrectFull.vue';
    const answers2 = [
        '15 or less',
        '16 - 20',
        '21 - 25',
        '26 - 30',
        '31 - 40',
        '41 - 50',
        '51 - 60',
        '61 - 70',
    ]

</script>

<template>
    <multiple-correct-full question-location="q2" question="what's your expected score" :answers="answers2" :buttons="['Previous', 'Save and Next']"  ></multiple-correct-full>
    
</template>