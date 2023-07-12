<template>
<img :src="imageUrl" alt="">
<button @click="fetchImages">fetchImages</button>
</template>
<script>
//   const VueMathjax = require('vue-mathjax-next')
import { getStorage, ref as firebaseStorageRef, getDownloadURL } from "firebase/storage";
const storage = getStorage();
  export default {
    name: "q4",
    props: {
      msg: String,
    },
    data() {
      return {
        formula: '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$',
        imageUrl: '',
      }
    },
    methods: {
      async fetchImages() {
        var pathReference
        pathReference = firebaseStorageRef(storage, "livecontestsubmission/live1/A6cqnRFjwth27cPIDCH1Tmuvzdi2/answers/q4/Screenshot 2023-01-27 at 9.23.04 PM.png"); 
        await getDownloadURL(pathReference)
        .then((url) => {
          this.imageUrl = url
        })
      }
    },

    
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>
  