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
    <multiple-correct-full question-location="q2" question="ಉಪಮುಖ್ಯಮಂತ್ರಿ ಡಿ ಕೆ ಶಿವಕುಮಾರ್ ಗೆ ಬಿಗ್ ರಿಲೀಫ್ : ಐದು ಪ್ರಕರಣ ರದ್ದುಗೊಳಿಸಿದ ಹೈಕೋರ್ಟ್" :answers="answers2" :buttons="['Previous', 'Save and Next']"  ></multiple-correct-full>
    <p>  When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are
      \[x = {-b \pm \sqrt{b^2-4ac} \over 2a}.\]</p>
</template>