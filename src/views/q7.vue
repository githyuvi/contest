<script setup>
    import MultipleCorrectFull from '../components/MultipleCorrectFull.vue';
    const answers2 = [
        'Arrays',
        'Linked list',
        'Stack',
        'Java',
        'Python',
        'C++',
        'Queue',
        'Ruby',
    ]

</script>

<template>
    <multiple-correct-full question-location="q2" question="Which of the following data structures are commonly used in DSA" :answers="answers2" :buttons="['Previous', 'Save and Next']"  ></multiple-correct-full>
    
</template>