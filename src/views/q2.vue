
<script setup>
    import { ref, computed } from "vue";
    // import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
    import { useRouter } from "vue-router";

    import { useStore } from 'vuex'
    import { getStorage, ref as firebaseStorageRef, uploadBytes,  } from "firebase/storage";
    import { getDatabase, ref as firebaseDatabaseRef, set, get, child } from "firebase/database";

    const store = useStore()
    const router = useRouter();

    const storage = getStorage();
    const storageRef = firebaseStorageRef(storage, '/q2');

    const db = getDatabase();
    const dbRef = firebaseDatabaseRef(db);

    var selectedFile = null;
    var userInputText = ref('')
    const receivedIsLoggedIn = computed(() => store.state.isRegistered)
    const userId = computed(() => store.state.userId)
    const userName = computed(() => store.state.userName)
    const userEmail = computed(() => store.state.userEmail)

    const initializeOptions = () => {
        get(child(dbRef, `q2/` + userId.value + '/text')).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val())

                    var value = snapshot.val()

                    userInputText.value = value
                    
                } else {
                    console.log('snapshot doesnt exist')
                }
                }).catch((error) => {
                console.error(error);
                });
    }

    initializeOptions();

    const nextpage = () => {
        router.push('/q3');
    }

    const previouspage = () => {
        router.push('/q1');
    }

    const handleFileUpload = (event) => {
        console.log(event.target.files[0])
        selectedFile = event.target.files[0];
        console.log(selectedFile)
    }

    const submitFile = () => {
        if (selectedFile) {
        // Perform processing logic here
        console.log('Processing file:', selectedFile);

        uploadBytes(firebaseStorageRef(storage, 'q2/' + userId.value + '/answer.jpg'), selectedFile).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        console.log("fullpath" + snapshot.metadata.fullPath)
        console.log(snapshot.ref.name)
        nextpage()
        
}).catch((error) => {
    console.log(error.message)
    alert("Submit error. Couldn't submit the answer")
});
      } else {
        console.log('No file selected');
      }
    }


    const submitText = () => {

        set(firebaseDatabaseRef(db, 'q2/' + userId.value), {
        username: userName.value,
        email: userEmail.value,
        text: userInputText.value,
  }).then((value) => {
//   console.log('set value' + value)
    nextpage();
   }, ).catch((e) => {
    console.log(e.message);
    alert("Submit error. Couldn't submit the answer")
  });
    }

    const handleUserInputText = (value) => {
        console.log(value)
        userInputText.value = value.target.value;

    }

</script>

<template>
    <h2>Q2. What do you prefer for web development? Django or Node? Why?</h2>
    <!-- <p><button @click="signInWithGoogle"  >Sign In With Google</button></p> -->
    <form @submit.prevent="submitText">
        <label for="text-input">Enter some text:</label>
        <input type="text" id="text-input" name="text-input" @change="handleUserInputText" :value="userInputText"><br>
        <input type="submit" value="Save & Next" v-if="receivedIsLoggedIn" >
        <br>
    <!-- <input type="submit" value="Submit Text"> -->
    </form>



    <p>Or submit an image file or a PDF/document</p>
    <form @submit.prevent="submitFile">
        <input type="file" name="myfile" @change="handleFileUpload">
        <br>
        <input type="submit" value="Upload File & Next" v-if="receivedIsLoggedIn" >
    </form>

      <br><br>

    <button @click="previouspage">Previous</button>
    <button @click="nextpage">Next</button>
</template>