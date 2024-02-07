b<template>
    <div>
      <ul>
        <li v-for="(url, index) in firebaseImageUrls" :key="index">
          <img :src="url" alt="Answer Image" style="max-width: 200px; max-height: 200px; border: 1px solid black;" />
        </li>
      </ul>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getDownloadURL, getStorage, ref as firebaseStorageRef,  } from 'firebase/storage';
  
  const firebaseImageUrls = ref([]);
  const storage = getStorage()

  const props = defineProps({image: Array})
  
  
    const fetchImageUrls = async () => {
    // Your logic to fetch image names or paths from Firebase Storage
    const imagePaths = props.image // Replace this with your actual image paths
  
    const urlsPromises = imagePaths.map(async (image) => {
      try {
        const url = await getDownloadURL(firebaseStorageRef(storage, image));
        return url;
      } catch (error) {
        console.error('Error fetching image URL:', error);
        return null;
      }
    });
  
    const urls = await Promise.all(urlsPromises);
    firebaseImageUrls.value = urls.filter(url => url !== null);
  }
  defineExpose({
    fetchImageUrls
  })

  
  onMounted(async() => await fetchImageUrls());
  </script>
  