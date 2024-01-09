<template>
    <div>
      <input hidden type="file" ref="fileInput" accept="image/*" multiple @change="handleFileUpload">
      <button @click="addMoreFiles" :disabled="files.length >= 5">Add Files</button>
      <button @click="submitFiles" :disabled="files.length === 0">Submit</button>
    </div>
<!--     
<div class="slide">
    <div class="slide-container" >
      <div class="slide-wrapper">
        <div class="slide-item" v-for="(file, index) in files" :key="index">
          <img :src="file.url" :alt="file.name" style="height: 60vh; width: fit-content;"/>
          <div></div>
          <button @click="removeFile(index)">Remove</button>
        </div>
      </div>
    </div>
</div> -->
    
  

<!-- <div class="slide-wrapper"> -->
  <!-- <VDContainer
       
    :data=files      
    
    type="sort"        
    @getData=funcName  
    >
    
    <template v-slot:VDC="{data, index}">
        <img :src="data.url" :alt="data.name" style="height: 30vh; width: fit-content; margin: 5px;"/>
        <div></div>
        <button @click="removeFile(index)">Remove</button>
        {{  data.name }}
    
    </template>
    
  </VDContainer> -->

  

<!-- </div> -->


<button @click="getData">getData</button>
<!-- <div class="slide-wrapper"> -->
  <div class="slide">
    <div class="slide-container" v-if="files.length > 0">
<draggable v-model="files" class="slide-wrapper" >
  
        <transition-group>
        <div class="slide-item" v-for="(file, index) in files" :key="index">
          <img :src="file.url" :alt="file.name" style="height: 30vh; width: fit-content;"/>
          <div></div>
          <button @click="removeFile(index)">Remove</button>
        </div>
      </transition-group>
     
      
    </draggable>
  <!-- </div> -->
</div>
      </div>

</template>
  
  <script>
  import { VueDraggableNext } from "vue-draggable-next";
  export default {
    components: {
      draggable: VueDraggableNext,

    },
    data() {
      return {
        files: []
      };
    },
    methods: {
      handleFileUpload() {
        const files = this.$refs.fileInput.files;
        // console.log('files', files)
        this.processFiles(files);
      },
      processFiles(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = () => {
            this.resizeImage(reader.result, 32000, 24000, (resizedDataUrl) => {
              this.files.push({
                name: file.name,
                type: file.type,
                url: resizedDataUrl
              });
            });
          };
          reader.readAsDataURL(file);
          // console.log('file', file)
        }
      },
      resizeImage(dataUrl, maxWidth, maxHeight, callback) {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          let width = image.width;
          let height = image.height;
  
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, width, height);
  
          const resizedDataUrl = canvas.toDataURL('image/jpeg');
          callback(resizedDataUrl);
        };
        image.src = dataUrl;
      },
      removeFile(index) {
        this.files.splice(index, 1);
        const fileInput = this.$refs.fileInput;
        const selectedFiles = Array.from(fileInput.files);
        selectedFiles.splice(index, 1);
        fileInput.value = '';

        // Reassign the updated file list to the `files` property of the `this.$refs.fileInput` element
        // fileInput.files = new DataTransfer().files.concat(selectedFiles);

      },
      addMoreFiles() {
        this.$refs.fileInput.click();
      },
      submitFiles() {
        // Logic to submit the files to the server
        // console.log(this.files)
      },
    }
  };
  </script>

<style scoped>
.slide {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.slide-container {
  width: 98%;
  overflow-x: auto;
  margin: 1px;
  /* height: 80vh; */
  /* padding-bottom: 40px;
  padding-top: 40px; */
  border: solid #d12f2f;
  border-width: 0.4vw;
  border-radius: 10px;
  padding: 30px 10px 40vw 10px;
}

.slide-wrapper {
  display: flex;
}
.slide-item:hover {
  border-width: 10px;
  border-color: red;
  border-style: solid;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.slide-item {
  flex-shrink: 0;
  /* width: 200px; */
  /* height: 50vh; */
  /* height: 70vh; */
  margin-right: 10px;
}
/* 
.slide-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
} */

.controls {
  margin-top: 10px;
  text-align: center;
}

button {
  margin: 0 5px;
}
</style>

