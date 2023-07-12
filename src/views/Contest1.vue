<script setup>
import { reactive } from 'vue';

    const submissionCount = reactive([])
    const questions = [
        {
            url: 'c1q1',
            name: 'Question 1',
            points: 100,
        },
        {
            url: 'c1q2',
            name: 'Question 2',
            points: 200,
        },
        {
            url: 'c1q3',
            name: 'Question 3',
            points: 150,
        },        
    ]

    //write a function to get the submission count for each question

</script>

<template>
    <div class="questions-list">
        <div v-for="question in questions" >
            <div class="question">
                <div class="question-name"><router-link :to= question.url target="_blank"> {{ question.name }}</router-link> </div>
                <div class="question-points">Points: {{question.points}}</div>
                <div class="question-submissions">Submissions: {{submissionCount[question.id]}}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        
        h1 {
            text-align: center;
        }
        
        .questions-list {
            margin-top: 30px;
        }
        
        .question {
            display: flex;
            align-items: center;
            background-color: #f5f5f5;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            padding-right: 30px;
            padding-left: 30px;
        }
        
        .question-name {
            flex-grow: 1;
            font-size: 18px;
            font-weight: bold;
        }
        
        .question-points,
        .question-submissions {
            font-size: 14px;
            margin-left: 10px;
        }
</style>