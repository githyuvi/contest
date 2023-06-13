<script setup>
import { ref, reactive } from 'vue';
const images = reactive([])
const handleFileUpload = (event) => {
    const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size <= 1048576) { // 1MB size capacity limit (in bytes)
          readFile(file)
            .then(result => {
              images.push({
                id: Date.now(),
                name: file.name,
                url: result
              });
            })
            .catch(error => {
              console.error('Error reading file:', error);
            });
        } else {
          alert(`File ${file.name} exceeds the size limit of 1MB.`);
        }
    }
}

const readFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    }
const submitImages = () => {
    console.log(images)
      // Logic to submit the images to the server
      // You can send the images to the server using Axios or any other HTTP library
      // For example:
      // axios.post('/upload', { images: this.images })
      //   .then(response => {
      //     console.log('Images uploaded successfully');
      //   })
      //   .catch(error => {
      //     console.error('Error uploading images:', error);
      //   });
    }
const remove = (index) => {
    images.splice(index, 1);
  }

// const handleImageUpload = () => {
//       const files = this.$refs.fileInput.files;
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file.size <= 1048576) { // 1MB size capacity limit (in bytes)
//           const reader = new FileReader();
//           reader.onload = () => {
//             images.push({
//               name: file.name,
//               url: reader.result
//             });
//           };
//           reader.readAsDataURL(file);
//         } else {
//           alert(`File ${file.name} exceeds the size limit of 1MB.`);
//         }
//       }
//     }

const openCamera =()=> {
      const constraints = { video: true, audio: false };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          const track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track);

          imageCapture.takePhoto()
            .then(blob => {
              const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
              processFiles([file]);
            })
            .catch(error => {
              console.error('Error taking photo:', error);
            })
            .finally(() => {
              track.stop();
            });
        })
        .catch(error => {
          console.error('Error accessing camera:', error);
        });
    }
const processFiles =(files) =>{
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size <= 1048576) { // 1MB size capacity limit (in bytes)
          const reader = new FileReader();
          reader.onload = () => {
            images.push({
              name: file.name,
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        } else {
          alert(`File ${file.name} exceeds the size limit of 1MB.`);
        }
      }
    }


</script>

<template>
    <div>
        <input type="file" multiple @change="handleFileUpload" accept="image/*">
        <p>images</p>
        <div v-for=" image , index in images" :key="image.id">
            <p>{{ index }}</p>
        <img :src="image.url" :alt="image.name" width="200">
        <button @click="remove(index)">remove</button>
        </div>

        <button @click="openCamera" :disabled="images.length >= 5">Camera Upload</button>
        <button @click="submitImages">Submit Images</button>
    </div>

    
</template>
