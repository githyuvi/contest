<template>
    <div>
      <h2>Create New Contest</h2>
      <div>
        <label for="contestName">Contest Name:</label>
        <input type="text" id="contestName" v-model="contestName" />
      </div>
  
      <div>
        <label for="xmlFile">Upload XML File:</label>
        <input type="file" id="xmlFile" @change="handleXMLFileUpload" />
      </div>
  
      <div>
        <label for="imageFiles">Upload Images:</label>
        <input type="file" id="imageFiles" multiple @change="handleImageFilesUpload" />
      </div>
  
      <button @click="createContest">Create Contest</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        contestName: '',
        xmlFile: null,
        imageFiles: [],
      };
    },
    methods: {
      handleXMLFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.xmlFile = file;
        }
      },
      handleImageFilesUpload(event) {
        const files = event.target.files;
        if (files.length > 0) {
          this.imageFiles = Array.from(files);
        }
      },
      createContest() {
        // Perform contest creation logic here
        // You can access the contest name, XML file, and image files via this.contestName, this.xmlFile, and this.imageFiles respectively
        // Example code to perform an API request or send the data to a backend server:
        const formData = new FormData();
        formData.append('contestName', this.contestName);
        formData.append('xmlFile', this.xmlFile);
        this.imageFiles.forEach((file, index) => {
          formData.append(`imageFile${index}`, file);
        });
  
        // Example API request using axios
        axios.post('/api/createContest', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => {
            // Handle success response
            console.log(response);
          })
          .catch(error => {
            // Handle error response
            console.error(error);
          });
      },
    },
  };
  </script>
  