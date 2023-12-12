<script setup>
import { ref } from 'vue';
const formula = ref('\[ \tan \frac{X}{2} \tan \frac{Y}{2} \tan \frac{Z}{2} \leq \frac{1}{3 \sqrt{3}} \]')
const formula2 = ref('\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.\)')
const formula3 = ref('Suppose $P$ and $Q$ are the centres of two disjoint circles $C_1$ and $C_2$ respectively, such that $P$ lies outside $C_2$ and $Q$ lies outside $C_1$. Two tangents are drawn from the point $P$ to the circle $C_2$, which intersect the circle $C_1$ at point $A$ and $B$. Similarly, two tangents are drawn from the point $Q$ to the circle $C_1$, which intersect the circle $C_2$ at points $M$ and $N$. Show that $A B=M N$')
</script>

<template>
    <div>
        <div style="text-align: center;">
            <div class="contest-list">
            <div class="contest-section">
                <h2>Ongoing Contests</h2>
                <div class="contest">
                    <div class="title"><router-link to="/live1"> Live 1 </router-link></div>
                    <div class="description">Description of Live 1</div>
                    <div class="date">Started: May 10, 2023</div>
                </div>
                <div class="contest">
                    <div class="title"><router-link to="/mddemo1"> md demo </router-link></div>
                    <div class="description">Description of demo 1</div>
                    <div class="date">Started: May 10, 2023</div>
                </div>
                <div class="contest">
                    <div class="title"><router-link to="/mddemo2"> md demo 2</router-link></div>
                    <div class="description">Description of demo 2</div>
                    <div class="date">Started: May 10, 2023</div>
                </div>
            </div>
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
        
        .contest-list {
            margin-top: 30px;
        }
        
        .contest-section {
            margin-bottom: 30px;
        }
        
        .contest-section h2 {
            margin-bottom: 10px;
        }
        
        .contest {
            background-color: #f5f5f5;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
        }
        
        .contest .title {
            font-size: 18px;
            font-weight: bold;
        }
        
        .contest .description {
            font-size: 14px;
            margin-top: 5px;
        }
        
        .contest .date {
            font-size: 12px;
            margin-top: 5px;
        }
</style>