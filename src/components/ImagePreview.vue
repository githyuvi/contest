<template>
  <div style="margin-bottom: 20px;">
    <input
      hidden
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      @change="handleFileUpload"
    />
    <div class="button-container">
    <button @click="addMoreFiles" :disabled="filesReactive.length >= 5">
      Add Files
    </button>
    </div>
    <p>*You can only upload a maximum of 5 files</p>
    <p>*Size of each file should be maximum of 1 MB</p>
  </div>


  <!-- <div class="slide-container" v-if="filesReactive.length > 0">
    <VueDraggableNext v-model="filesReactive" class="slide-wrapper">
      <transition-group>
        <div
          class="slide-item"
          v-for="(file, index) in filesReactive"
          :key="index"
        >
          <img
            :src="file.url"
            :alt="file.name"
            style="margin-top: 5px; max-width: 50vw; max-height: 50vh"
          />
          <div></div>
          <button @click="removeFile(index)">Remove</button>
        </div>
      </transition-group>
    </VueDraggableNext>
  </div> -->

  <div class="slide">
    <div class="slide-container" v-if="filesReactive.length > 0">
      <VueDraggableNext v-model="filesReactive" class="slide-wrapper">
        <transition-group>
          <div class="slide-item" v-for="(file, index) in filesReactive" :key="index">
            <img
              :src="file.url"
              :alt="file.name"
              style="height: 30vh; width: fit-content"
            />
            <div></div>
            <button @click="removeFile(index)">Remove</button>
          </div>
        </transition-group>
      </VueDraggableNext>
    </div>
  </div>
</template>

<script setup>
import { VueDraggableNext } from "vue-draggable-next";
import { computed, onMounted, ref, reactive } from "vue";


const filesReactive = reactive([]);
var imageFiles = [];
const fileInput = ref(null);

const emits = defineEmits(["get-files"]);

const handleFileUpload = () => {
  var files = fileInput.value.files;
  const sum = filesReactive.length + files.length;
  if (sum > 5) {
    alert("You can only upload a maximum of 5 files");
  }
  for (let i = 0; i < files.length && i < 5 - filesReactive.length; i++) {
    imageFiles.push(files[i]);
  }
  processFiles(files, 5 - filesReactive.length);
  emits("get-files", imageFiles);
};

const processFiles = (files, limit) => {
  for (let i = 0; i < files.length && i < limit; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = () => {
      resizeImage(reader.result, 32000, 24000, (resizedDataUrl) => {
        filesReactive.push({
          name: file.name,
          type: file.type,
          url: resizedDataUrl,
        });
      });
    };
    reader.readAsDataURL(file);
  }
};

const resizeImage = (dataUrl, maxWidth, maxHeight, callback) => {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
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

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, width, height);

    const resizedDataUrl = canvas.toDataURL("image/jpeg");
    callback(resizedDataUrl);
  };
  image.src = dataUrl;
};

const removeFile = (index) => {
  filesReactive.splice(index, 1);
  imageFiles.splice(index, 1);
  emits("get-files", imageFiles)
};

const addMoreFiles = () => {
  fileInput.value.click();
};

</script>

<style scoped>

img {
  width: 100%;
  height: auto;
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
  max-width: 100%;
}

.controls {
  margin-top: 10px;
  text-align: center;
}

button {
  margin: 0 5px;
}


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
  padding: 30px 10px 20px 10px;
}

.slide-wrapper {
  display: flex;
}

.button-container {
  padding: 10px;
  position: relative;
}

.button-container button {
    margin: 0 5px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
}


</style>

