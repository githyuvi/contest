<script setup>
    import { ref, onMounted, onUnmounted, computed, reactive } from "vue";
    // import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
    import { routerKey, useRouter } from "vue-router";

    import { useStore } from 'vuex';
    import { getDatabase, ref as firebaseRef, set, get, child } from "firebase/database";
    import SingleCorrect from "../components/SingleCorrect.vue";

    import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
    

    const db = getDatabase();
    const dbRef = firebaseRef(db);
  
    const store = useStore()
    const router = useRouter()

    const userId = computed(() => store.state.userId)
    const userName = computed(() => store.state.userName)
    const userEmail = computed(() => store.state.userEmail)
    const isLoggedIn = computed(() => store.state.isLoggedIn)

    const notAttempted = ref(false)

    const isAnswered1 = ref(true)
    const isAnswered2 = ref(true)


    const getToggles = (length) => {
    const toggles = reactive([])
    console.log('gettoggles called')
    for(var i = 0;i<length;i++) {
        toggles.push({value: ref('')})

    }
    // console.log(toggles)
    // console.log(toggles[0])
    // console.log('option' + option)
    // console.log('gettoggles')
    // if(option != '')
    // // toggles[parse]
    // toggles[parseInt(option)-1] = {value:ref('selected')}
    return toggles
}

    const selectedToggle1 = getToggles(5)
    const selectedToggle2 = getToggles(8)
    

    const answers1 = [
        '15 or less',
        '16 - 20',
        '21 - 25',
        '26 - 30',
        '31 - 40',
    ]

    const answers2 = [
        '0 - 10',
        '11 - 20',
        '21 - 30',
        '31 - 40',
        '41 - 50',
        '51 - 60',
        '61 - 70',
        '71 - 80',
        

    ]
    
    const options1 = []
    const options2 = [] 
    
    var optionSelected1 = ''
    var optionSelected2 = ''

    const initializeOptions = () => {
    
        for (let i = 0; i < answers2.length; i++) {
            const element = answers2[i];

            options2.push({
                index: i,
                id: (i+1).toString(),
                label: element
            })
        
        }

        for (let i = 0; i < answers1.length; i++) {
            const element = answers1[i];
            options1.push({
                index: i,
                id: (i+1).toString(),
                label: element
            })
        
        }
    }
    const initialize = () => {
        console.log(selectedToggle1)
        get(child(dbRef, `poll/` + userId.value)).then((snapshot) => {
            console.log('doing something')
            if(snapshot.exists()) {
                notAttempted.value = false
                console.log('snapshot exists')
                const userAnswers = snapshot.val()
                console.log(userAnswers)
                const selectedIndex1 = parseInt(userAnswers.q1)-1
                const selectedIndex2 = parseInt(userAnswers.q2)-1
                selectedToggle1[selectedIndex1].value = 'selected'
                // console.log('value' +selectedToggle1[selectedIndex1].value)
                selectedToggle2[selectedIndex2].value = 'selected'
                isAnswered1.value = true
                isAnswered2.value = true    
                
            }
            else {
                isAnswered1.value = false
                isAnswered2.value = false
                notAttempted.value = true
                
            }
        }).catch((error) => {
            console.log(error)
            if(isLoggedIn.value)
            alert("couldn't fetch results")
            
        });
    }

    initializeOptions()
    initialize()

    const handleOptionSelected1 = (value) => {
        console.log('handle option selected')
        optionSelected1 = value
    }

    const handleOptionSelected2 = (value) => {
        console.log('handle option selected 2')
        optionSelected2 = value
    }

    const submitPoll = () => {
        if(optionSelected1 == '' || optionSelected2 == '')
        alert('attempt all questions')
        else {


            set(firebaseRef(db, 'poll/' + userId.value), {
            username: userName.value,
            email: userEmail.value,
            q1: optionSelected1,
            q2: optionSelected2
            }).then((value) => {
            router.push('./pollresults')
            }, ).catch((e) => {
                console.log(e.message);
                alert("Submit error. Couldn't submit the answer")
            });
            }

    }

    const signIn = () => {
        const provider = new GoogleAuthProvider();
        
        signInWithPopup(getAuth(), provider).then((result) => {
            console.log(result.user)
            console.log(result.user.uid)
            console.log(result.user.photoURL)
            store.commit('setUserId', result.user.uid),
            store.commit('setUsername', result.user.displayName),
            store.commit('setUserEmail', result.user.email)
            store.commit('setUserImageUrl', result.user.photoURL)

            console.log("dbref after store.commit" + dbRef)
            router.push('/poll').then((result) => {
                window.location.reload()
            }).catch((error) => {
                console.log(error)
            }) 
        }).catch((error) => {
            console.log(error);
        });
    }
    
</script>

<template>

        <div style="text-align: center;">
            <single-correct :is-answered="isAnswered1" :selected-toggle="selectedToggle1" question-number="1" question="What marks do you expect in part A" :options="options1" @get-option-selected1="handleOptionSelected1"> </single-correct>
            <br>
            <single-correct :is-answered="isAnswered2" :selected-toggle="selectedToggle2" question-number="2" question="What marks do you expect in part B" :options="options2" @get-option-selected2="handleOptionSelected2"> </single-correct>
            <br>
            <input v-if="!isLoggedIn"  type="button" value="Sign In" @click="signIn">
            <input v-if="notAttempted && isLoggedIn"  type="button" value="submit poll" @click="submitPoll">
        </div>



        
        <!-- <single-correct question-number="1" question="What marks do you expect in part A" :options="options1" > </single-correct>
        <single-correct question-number="2" question="What marks do you expect in part B" :options="options2" > </single-correct> -->
        
    
  <br>

  

</template>

<style scoped>
  
 
</style>