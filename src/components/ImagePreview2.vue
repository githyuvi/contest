<template>
    <!-- <div><button @click="() => { console.log(images);console.log(imageFiles) }">log image</button></div> -->
    <hr style="height: 3px; background-color: gray;">

    <div class="document-scanner">
        <!-- <div>video width {{ videoWidth }} video height {{ videoHeight }}</div> -->
        <input hidden type="file" ref="fileInput" @change="addImageFromDevice" accept="image/*" multiple>
        <input hidden type="file" ref="cameraInput" @change="addImageFromDevice" accept="image/*" capture="camera">
        <div
            style="border-color: #422d95;border-width: 1px;border-style: solid;text-align: center;border-radius: 10px; padding: 10px;">
            <div style="margin-bottom: 5px;"><b>Upload Your Answer </b></div>
            <hr>
            <div class="upload-files-button-container">
                <button @click="addMoreFiles" :disabled="images.length >= MAXFILES">
                    Device
                </button>
                <button @click="addMoreCameraFiles" :disabled="images.length >= MAXFILES">Camera</button>
            </div>
            <hr>
            <div style="margin-top: 5px;text-align: left;">* You can only upload a maximum of {{ MAXFILES }} files</div>
            <!-- <div style="text-align: left;">* Max file size 500 KB</div> -->
            <div style="text-align: left;">* Click up arrow, down arrow to reorder images </div>
        </div>

        <!-- <div class="edit-button"><button @click="addMoreFiles" :disabled="images.length >= MAXFILES">
                    Edit
                </button></div> -->
        <div>
            <div v-for="(image, index) in images" :key="index" class="image-item">
                <div><img :src="image" alt="Scanned Document"></div>
                <div class="flex items-center ml-1 space-y-1 flex-col">
                    <button @click="moveImageUp(index)" :disabled="index === 0"
                        class="p-2 border rounded-md focus:outline-none focus:border-blue-500">
                        <i class="fas fa-chevron-up"></i> 
                    </button>
                    <button @click="moveImageDown(index)" :disabled="index === images.length - 1"
                        class="p-2 border rounded-md focus:outline-none focus:border-blue-500">
                        <i class="fas fa-chevron-down"></i> 
                    </button>
                    <button @click="removeImage(index)"
                        class="p-2 border rounded-md focus:outline-none focus:border-blue-500">
                        <i class="fas fa-trash-alt"></i> 
                    </button>
                </div>

            </div>
        </div>


    </div>

    <div class="camera-modal" id="confirmCameraModal">
        <div class="camera-modal-content">
            <div id="video-container"></div>
            <div style="display: flex;justify-content: space-between;">
                <button @click="captureImageFromCamera">Capture Image</button>
                <button @click="stopCamera">Close Camera</button>
            </div>
        </div>
    </div>
    <div id="snackbar">
        <div>Max 5 files allowed</div>
        <div>Removed Extra files</div>
    </div>
</template>
  
<script setup>
import { onMounted, ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

const videoWidth = ref(0)
const videoHeight = ref(0)

const props = defineProps({
    files: Array,
    maxFiles: {
        type: Number,
        default: 5
    }
});

const images = ref([]);
let imageFiles = props.files
// watch(props.files, (newVal) => {
    
//     // console.log(newVal)
//     if (newVal.length == 0) {
//         console.log('i am in watch', newVal)
//         imageFiles = newVal
//         images.value = ref([])
//     }
// })

const fileInput = ref(null)
const cameraInput = ref(null)
const MAXFILES = props.maxFiles;
console.log(MAXFILES)
const MAX_FILE_SIZE = 1024 * 1024;
let videoStream = null;
let currentDevice = 'environment'; // 'user' represents the front camera, 'environment' represents the back camera
const addMoreFiles = () => {
    fileInput.value.click();
};
const addMoreCameraFiles = () => {
    if (isMobileTablet())
        cameraInput.value.click();
    else
        showConfirmationModal()
};

function mobileTableCheck(a) {
    let check = false
    // console.log('a', a)
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        check = true;
    return check
}

function isMobileTablet() {
    var check = false

    check = mobileTableCheck(navigator.userAgent || navigator.vendor || window.opera);

    return check;
}

const emits = defineEmits(["get-files"]);
let startCameraFlag = false
const startCamera = async () => {
    if (startCameraFlag)
        return
    startCameraFlag = true
    try {
        const videoElement = document.createElement('video');
        const constraints = {
            video: { facingMode: currentDevice }
        };
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);

        videoElement.style = "max-width: 100%; max-height: 100%"
        videoElement.srcObject = videoStream;
        videoElement.play();

        const videoContainer = document.getElementById('video-container');
        videoContainer.appendChild(videoElement);
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Error accessing camera.');
    }
};

onBeforeRouteLeave((to, from, next) => {
    stopCamera()
    next()
    location.reload()
})

const stopCamera = () => {
    startCameraFlag = false
    if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.srcObject = null;
            videoElement.remove();
        }
    }
    closeModal()
};

const captureImageFromCamera = async () => {
    try {
        const maxpixels = 3600 * 4800
        const videoElement = document.querySelector('video');
        const canvas = document.createElement('canvas');
        let f;


        f = Math.sqrt(maxpixels / (videoElement.videoWidth * videoElement.videoHeight))

        canvas.width = videoElement.videoWidth * f;
        canvas.height = videoElement.videoHeight * f;

        console.log('vide width', canvas.width)
        console.log('vide height', canvas.height)
        videoWidth.value = canvas.width
        videoHeight.value = canvas.height

        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/png');

        const resizedBase64 = await resizeBase64Image(imageDataURL, 2400 * 3200); // Max width and height
        images.value.push(resizedBase64);
        imageFiles.push(convertBase64ToFile(resizedBase64, `image${Math.floor(Math.random() * 100).toString()}`));
        emits("get-files", imageFiles);
        stopCamera();
    } catch (error) {
        console.error('Error capturing image:', error);
        alert('Error capturing image.');
    }
};

async function showConfirmationModal() {
    await startCamera().then(() => {
        document.getElementById('confirmCameraModal').style.display = 'block';
    })
        .catch((e) => {
        })
}

function closeModal() {
    document.getElementById('confirmCameraModal').style.display = 'none';
}

const addImageFromDevice = async (event) => {
    const files = event.target.files;
    const length = images.value.length
    if (length + files.length > MAXFILES) {
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

    }
    
    if (files) {
        for (let i = 0; i < files.length && i < MAXFILES - length; i++) {
            const reader = new FileReader();
            reader.onload = async () => {
                //resized
                console.log(files[i].name)
                await resizeBase64Image(reader.result, 2400 * 3200).then((resizedBase64) => {
                    images.value.push(resizedBase64);
                    imageFiles.push(convertBase64ToFile(resizedBase64, files[i].name));
                });


            };
            reader.readAsDataURL(files[i]);
        }
        console.log('after', imageFiles)
        console.log('after', images.value)
        emits("get-files", imageFiles);
    }
};

const moveImageUp = (index) => {
    if (index > 0) {
        const temp = images.value[index];
        images.value.splice(index, 1);
        images.value.splice(index - 1, 0, temp);

        const temp2 = imageFiles[index];
        imageFiles.splice(index, 1);
        imageFiles.splice(index - 1, 0, temp2);
    }
    emits("get-files", imageFiles);
};

const moveImageDown = (index) => {
    if (index < images.value.length - 1) {
        const temp = images.value[index];
        images.value.splice(index, 1);
        images.value.splice(index + 1, 0, temp);

        const temp2 = imageFiles[index];
        imageFiles.splice(index, 1);
        imageFiles.splice(index + 1, 0, temp2);
    }
    emits("get-files", imageFiles);
};

const removeImage = (index) => {
    images.value.splice(index, 1);
    imageFiles.splice(index, 1);
    console.log(images.value)
    console.log(imageFiles)
    emits("get-files", imageFiles);
};

const convertBase64ToFile = (base64String, fileName) => {
    const byteString = atob(base64String.split(',')[1]);
    const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], fileName, { type: mimeString });
};

const resizeBase64Image = (base64String, totalPixels) => {
    totalPixels = totalPixels / 2
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;


            let factor;
            if (width * height > totalPixels)
                factor = Math.sqrt(totalPixels / (width * height))
            else
                factor = 1

            width = width * factor
            height = height * factor

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const resizedBase64 = canvas.toDataURL('image/jpeg'); // Convert to JPEG for better compression
            resolve(resizedBase64);
        };

        img.src = base64String;
    });
};

onMounted(() => {
    const files = imageFiles
    // console.log('len',imageFiles.length)
    for (let i = 0; i < imageFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = async () => {
            //resized
            await resizeBase64Image(reader.result, 2400 * 3200).then((resizedBase64) => {
                images.value.push(resizedBase64);
            });


        };
        reader.readAsDataURL(files[i]);
    }

})

</script>
  
<style scoped>
/* Style the component */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import '../assets/snackbar.css';

.document-scanner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    width: 95%;
}

.image-item {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
}

.image-item img {
    max-width: 100%;
    max-height: 300px;
    margin-left: 2px;
}

.image-controls button {
    margin-right: 5px;
}

.image-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.camera-modal {
    display: none;
    /* Hide the modal by default */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Semi-transparent background */
    z-index: 9999;
    overflow: auto;
}

.camera-modal-content {
    /* position: absolute; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    justify-self: center;
    align-self: center;
    /* top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); */
    background-color: white;
    padding: 1px;
    text-align: center;
    height: 100%;
    margin: 20px 1px;
    /* margin-bottom: 20px; */
    /* max-width: 98%; */
}

.camera-modal-content button {
    margin: 0 5px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
}

.video-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}


.upload-files-button-container button {
    margin: 0 5px;
    padding: 10px 20px;
    background-color: #422d95;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.edit-button button {
    margin: 0 5px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
}
</style>
  