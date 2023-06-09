<script setup>
    import { ref, computed } from "vue";
    // import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
    import { useRouter } from "vue-router";

    import { useStore } from 'vuex'

    import { reactive } from "vue";
    import { getDatabase, ref as firebaseRef, set, get, child } from "firebase/database";

    const db = getDatabase();
    const dbRef = firebaseRef(db);
    const store = useStore()
    const router = useRouter();

    const selectedOptions = []
    // const answers = [ref(false), ref(''), ref(''), ref('')]

    const answers = reactive([
      { value: ref(false) },
      { value: ref(false) },
      { value: ref(false) },
      { value: ref(false)}
    ]);

    const checked = reactive([
      {value: ref(false)},
      {value: ref(false)},
      {value: ref(false)},
      {value: ref(false)},
    ])

    const options = [
    { index:0, id: 'a', label: '3', },
    { index:1, id: 'b', label: '-3', },
    { index:2, id: 'c', label: '-2', },
    { index:3, id: 'd', label: '2', },
    ]

    const userId = computed(() => store.state.userId)
    const userName = computed(() => store.state.userName)
    const userEmail = computed(() => store.state.userEmail)
    const receivedIsRegistered = computed(() => store.state.isRegistered)

    const initializeOptions = () => {
      
        get(child(dbRef, `q3/` + userId.value + '/answer')).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val())

                    var value = snapshot.val()
                    var length = value.length;

                    for(var i = 0; i<length;i++) {
                      var option = value[i]

                      switch (option) {
                        case 'a':
                            checked[0].value = true
                            answers[0].value = true
                            break;
                        
                        case 'b':
                        checked[1].value = true
                        answers[1].value = true
                        break;

                        case 'c':
                        checked[2].value = true
                        answers[2].value = true
                        break;

                        case 'd':
                        checked[3].value = true
                        answers[3].value = true
                        break;
                    
                        default:
                            break;
                    }
                    }
                    
                    
                } else {
                    console.log('snapshot doesnt exist')
                }
                }).catch((error) => {
                console.error(error);
                });
    }

    initializeOptions();

    const previouspage = () => {
        router.push('/q2');
    }

    const homepage = () => {
        router.push('/');
    }

    const submitForm = () => {
        
        console.log(answers[0].value)
        console.log(answers[1].value)
        console.log(userName.value)
        console.log(computed(() => store.state.userName))

        computeAnswers()
        console.log(selectedOptions)

        set(firebaseRef(db, 'q3/' + userId.value), {
        username: userName.value,
        email: userEmail.value,
        answer: selectedOptions
  }).then((value) => {
    
    router.push('./q1')
  }).catch(error => {
    alert("Submit error. Couldn't submit the answer")
  });
    }

    const computeAnswers = () => {
        if(answers[0].value)
        selectedOptions.push('a')
        if(answers[1].value)
        selectedOptions.push('b')
        if(answers[2].value)
        selectedOptions.push('c')
        if(answers[3].value)
        selectedOptions.push('d')
    }
    

</script>

<template>

  <h2>Q3. Solve for x: x^2 + 5x + 6 = 0</h2>
  <!-- <p><button @click="signInWithGoogle">Sign In With Google</button></p> -->

<form @submit.prevent="submitForm" >
  <div v-for="option in options" :key="option.id">
      <label>
        <input
          type="checkbox"
          :value="option.id"
          v-model="answers[option.index].value"
          :checked="checked[option.index].value"
        />
        {{ option.label }}
      </label>
    </div>

  <button v-if="receivedIsRegistered" type="submit">Save & Next</button><br>

  <!-- <label for="text-input">Enter your solution</label>
  <input type="text" id="text-input" name="text-input"><br>
  <input type="submit" value="Submit Answer" v-if="receivedIsLoggedIn" >
  <br><br> -->

</form>

<button @click="previouspage">Previous</button>
<button @click="homepage">Finish</button>
<br>

</template>

