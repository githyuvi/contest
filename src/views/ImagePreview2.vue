<template>
    <div>
      <input type="file" ref="fileInput" accept="image/*" multiple @change="handleFileUpload">
      <!-- <div v-for="(file, index) in files" :key="index" style="width: 50vw;">
        <img :src="file.url" :alt="file.name" >
        <button @click="removeFile(index)">Remove</button>
      </div> -->
      <button @click="addMoreFiles" :disabled="files.length >= 5">Add More Files</button>
      <button @click="submitFiles" :disabled="files.length === 0">Submit</button>
    </div>
    <div class="slide">
    <div class="slide-container">
      <div class="slide-wrapper">
        <div class="slide-item" v-for="(file, index) in files" :key="index">
          <img :src="file.url" :alt="file.name" style="height: 50vh; width: fit-content;"/>
          <div></div>
          <button @click="removeFile(index)">Remove</button>
        </div>
      </div>
    </div>
  </div>

</template>
  
  <script>
  export default {
    data() {
      return {
        files: []
      };
    },
    methods: {
      handleFileUpload() {
        const files = this.$refs.fileInput.files;
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
          console.log('file', file)
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
      },
      addMoreFiles() {
        this.$refs.fileInput.click();
      },
      submitFiles() {
        // Logic to submit the files to the server
        console.log(this.files)
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
  width: 100%;
  overflow-x: auto;
  /* height: 80vh; */
  padding-bottom: 40px;
  padding-top: 40px;
}

.slide-wrapper {
  display: flex;
}

.slide-item {
  flex-shrink: 0;
  /* width: 200px; */
  /* height: 50vh; */
  /* height: 70vh; */
  margin-right: 10px;
}

.slide-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.controls {
  margin-top: 10px;
  text-align: center;
}

button {
  margin: 0 5px;
}
</style>

