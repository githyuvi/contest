<script setup>
    import { Delta, QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'

    import { ref } from 'vue'

    import { getDatabase, ref as firebaseRef, set, get, child } from "firebase/database";
import { onMounted } from 'vue';
import { reactive } from 'vue';

    const db = getDatabase();
    const dbRef = firebaseRef(db);

    const richvalue = ref({})
    var richText = ''
    const ff = reactive({})
    const richtext2 = ref({})

    const logRichValue = () => {
        console.log(richvalue)
        console.log(richvalue.value)
        var data = JSON.stringify({title: 'quill' , content: JSON.stringify(richvalue.value)})
        console.log(data)
        console.log(ff)
    }

    const sendToFirebase = () => {
      set(firebaseRef(db, 'q5/' ), {
        richtext: richvalue.value
  }).then(alert("sent successfully"))    
    }

    const fetchFromFirebase = () => {
      get(child(dbRef, `q5/richtext` )).then((snapshot) => {
        // ff.value = JSON.stringify(snapshot.val())
        // console.log(ff.value)
        ff.value = 'hello'

        
      
      })
    }

    onMounted(() => {
      fetchFromFirebase()
    }
    )

    const updateQuill = () => {
      // fetchFromFirebase()
    }

    
    
</script>

<template>
    <!-- <QuillEditor theme="snow" toolbar="full" /> -->

    <QuillEditor toolbar="full" v-model:content="richvalue" >
    <!-- <template #toolbar>
      <div id="my-toolbar2"> -->
        <!-- Add buttons as you would before -->
        <!-- <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-formula"></button>
        <button class="ql-direction"></button>
        <button class="ql-code"></button> -->

        <!-- But you can also add your own -->
        <!-- <button id="custom-button"></button>
      </div>
    </template> -->
  </QuillEditor>

  <button @click="logRichValue">log rich value</button>
  <br>

  <br>

  <div style="background-color: gray;">
    {{ richvalue }}
  </div>

  <br>

  <button @click="sendToFirebase"> send to firebase</button>
  <br>
  <button @click="fetchFromFirebase"> fetch From firebase</button>

   <br>

  <div style="background-color: gray;">
    fetched firebase value {{ ff  }}
  </div>

  <br>

  

    <QuillEditor toolbar="#my-toolbar" v-model:content="ff" >
    <template #toolbar>
      <div id="my-toolbar">
        <!-- Add buttons as you would before -->
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-formula"></button>
        <button class="ql-direction"></button>
        <button class="ql-code"></button>

        <!-- But you can also add your own -->
        <button id="custom-button"></button>
      </div>
    </template>
  </QuillEditor>



</template>