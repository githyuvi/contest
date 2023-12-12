<template>
    <input type="file" ref="fileInput" accept="image/*" multiple @change="handleFileUpload">
      <!-- <div v-for="(file, index) in files" :key="index" style="width: 50vw;">
        <img :src="file.url" :alt="file.name" >
        <button @click="removeFile(index)">Remove</button>
      </div> -->
      <button @click="addMoreFiles" :disabled="images.length >= 5">Add Files</button>
      <button @click="submitFiles" :disabled="images.length === 0">Submit</button>
    <div class="slide">
        <div class="slide-container">
        <transition-group name="fade" tag="ul">
            <li v-for="(image, index) in images" :key="index">
            <img style="height: 60vh; width: fit-content;" :src="image.url" alt="Slide Image" :draggable="!submitted" @dragstart="dragStart(index)" @dragover="dragOver(index)" @drop="drop(index)" @dragend="dragEnd" />
            </li>
        </transition-group>
        </div>
      <div class="controls">
        <button @click="prevSlide">Previous</button>
        <button @click="nextSlide">Next</button>
      </div>
      <div v-if="submitted">
        <h3>Reordered Images:</h3>
        <ul>
          <li v-for="(image, index) in reorderedImages" :key="index">
            <span>{{ image.label }}</span>
          </li>
        </ul>
        <button @click="submitOrder" :disabled="!canSubmit">Submit</button>
      </div>
    </div>
</template>
  
<script>
  export default {
    data() {
      return {
        images: [
        ],
        submitted: false,
        draggedIndex: null,
        droppedIndex: null
      };
    },
    computed: {
      reorderedImages() {
        return this.images.slice().sort((a, b) => a.label.localeCompare(b.label));
      },
      canSubmit() {
        const originalOrder = this.images.map(image => image.label);
        const reorderedOrder = this.reorderedImages.map(image => image.label);
        return JSON.stringify(originalOrder) !== JSON.stringify(reorderedOrder);
      }
    },
    methods: {
      prevSlide() {
        // Previous slide logic
      },
      nextSlide() {
        // Next slide logic
      },
      dragStart(index) {
        this.draggedIndex = index;
      },
      dragOver(index) {
        this.droppedIndex = index;
      },
      drop(index) {
        if (index !== this.draggedIndex) {
          this.images.splice(index, 0, this.images.splice(this.draggedIndex, 1)[0]);
        }
        this.draggedIndex = null;
        this.droppedIndex = null;
      },
      dragEnd() {
        this.draggedIndex = null;
        this.droppedIndex = null;
      },
      submitOrder() {
        this.submitted = true;
      },
      handleFileUpload() {
        const files = this.$refs.fileInput.files;
        console.log('files', files)
        this.processFiles(files);
      },
      processFiles(files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = () => {
            this.resizeImage(reader.result, 32000, 24000, (resizedDataUrl) => {
              this.images.push({
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
    }
  };
  </script>
  
  <style>
  /* Slide styling */
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  
  .slide-container {
    /* height: 300px; */
    overflow: hidden;
  }
  
  .slide-container ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    height: 100%;
  }
  
  .slide-container ul li {
    width: 100%;
    height: 100%;
    cursor: grab;
  }
  
  .slide-container ul li:active {
    cursor: grabbing;
  }
  
  .slide-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Reordered images styling */
  
  .controls {
    margin-top: 10px;
    text-align: center;
  }
  
  button {
    margin: 0 5px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 5px;
    background-color: #f8f8f8;
  }
  </style>
  