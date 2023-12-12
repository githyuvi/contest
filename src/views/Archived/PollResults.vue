<script setup>
import { ref, computed, reactive } from 'vue'
import { get, getDatabase, ref as firebaseRef, child } from '@firebase/database'
import { useStore } from "vuex"
import { getFunctions, httpsCallable } from 'firebase/functions';

    const functions = getFunctions()
    const getPollResults = httpsCallable(functions, 'getPollResults',)

    const attempted = ref(false)
    const question1 = 'What marks do you expect in part A'
    const question2 = 'What marks do you expect in part B'
    const downloaded = ref(false)
    var options1 = reactive([
        ['15 or less',0],
        ['16 - 20',0],
        ['21 - 25',0],
        ['26 - 30',0],
        ['31 - 40',0],
    ])
    var options2 = [
        ['0 - 10',0],
        ['11 - 20',0],
        ['21 - 30',0],
        ['31 - 40',0],
        ['41 - 50',0],
        ['51 - 60',0],
        ['61 - 70',0],
        ['71 - 80',0],
    ]
 
    const store = useStore();
    const db = getDatabase();
    const dbRef = firebaseRef(db);
    const userId = computed(() => store.state.userId)

    var total1 = 0
    var total2 = 0


    const initializeResults = async () => {
        console.log('initializing results');
        await get(child(dbRef, `poll/` + userId.value)).then((snapshot) => {
            console.log('doing something')
            if(snapshot.exists()) {
                attempted.value = true
                console.log('snapshot exists')
                getPollResults()
            }
            else {
                alert('Submit polls to view results')
            }
        }).catch((error) => {
            alert("couldn't fetch results")
        });
        
    }


    initializeResults().then(() => {
        // if(attempted.value == false)
        // return
    getPollResults()
    .then((result) => {
        console.log(result );
        const responseData = result.data.responseData;
        options1 = responseData.options1
        options2 = responseData.options2
        total1 = responseData.total1
        total2 = responseData.total2
        downloaded.value = true
        
    }).catch((error) => {
        console.log(error)
    })
    
})

  

    

</script>

<template>

<div v-if="(attempted && downloaded)"   id="pollresults" >
        <section class = "poll">
            <h1>{{ question1 }} </h1>
            <div v-for="option in options1" >
                <div class="poll-option">
                <span class="poll-option__label">{{ option[0] }}</span>
                <table class="poll-option__result">
                <tr>
                    <td>{{ option[1] }}</td>
                    <td>
                    <span></span>
                    <span :style="{width: Math.round(option[1]/total1 * 100) + '%'}"></span>
                    </td>
                    <td>{{ Math.round(option[1]/total1 * 100)}}%</td>
                </tr>
                </table>
                </div>

            </div>
        </section>
            <!-- <br> -->
            <section class = "poll">
            <h1>{{ question2 }} </h1>
            <div v-for="option in options2" >
                <div class="poll-option">
                <span class="poll-option__label">{{ option[0] }}</span>
                <table class="poll-option__result">
                <tr>
                    <td>{{ option[1] }}</td>
                    <td>
                    <span></span>
                    <span :style="{width: Math.round(option[1]/total2 * 100) + '%'}"></span>
                    </td>
                    <td>{{ Math.round(option[1]/total2 * 100)}}%</td>
                </tr>
                </table>
                </div>

            </div>

            <!-- <div class="poll-option">
                <span class="poll-option__label">Option 1</span>
                <table class="poll-option__result">
                <tr>
                    <td>200</td>
                    <td>
                    <span></span>
                    <span style="width: 25%;"></span>
                    </td>
                    <td>25%</td>
                </tr>
                </table>
            </div> -->
  
            
        </section>
    </div>
</template>

<style scoped>
     .poll {

	 background: aquamarine;
	 font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
     max-width: 700px;
     margin: 0 auto;
     /* text-align: center; */
     /* text-align: center; */
     /* align-self: center; */
}
 /* section {
	 transform: translate(-50%, -50%);
	 position: absolute;
	 top: 50%;
	 left: 50%;
	 width: 60%;
} */
 .poll-option {
	 margin-bottom: 25px;
}
 span.poll-option__label {
	 font-weight: bold;
}
 table.poll-option__result {
	 width: 100%;
}
 table.poll-option__result tr, table.poll-option__result td {
	 padding: 0;
}
 table.poll-option__result td:nth-child(odd) {
	 width: 40px;
}
 table.poll-option__result td:nth-child(even) {
	 border: 0;
	 height: 100%;
	 position: relative;
	 vertical-align: center;
	 width: 100%;
}
 table.poll-option__result td:first-child {
	 padding-right: 20px;
}
 table.poll-option__result td:last-child {
	 padding-left: 20px;
}
 table.poll-option__result span {
	 border-radius: 3px;
	 display: block;
	 height: 6px;
	 position: absolute;
	 top: 50%;
	 transform: translateY(-50%);
}
 table.poll-option__result span:first-child {
	 background: rgba(0, 0, 0, 0.1);
	 width: 100%;
}
 table.poll-option__result span:last-child {
	 background: aliceblue;
	 background-image: linear-gradient(to right, #ff5a00, #e3a417);
}
</style>

