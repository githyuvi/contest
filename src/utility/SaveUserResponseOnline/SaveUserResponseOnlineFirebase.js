import {get, set} from '../Database/FirebaseDatabase'
import { getStorage, ref as firebaseStorageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseInit from "../"

async function saveScMc(submissionType,  contestName,userId, questionLocation, optionSelected){
    await set(submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/options",
        optionSelected
    )
}

async function saveMc(submissionType, userId, contestName, questionNumber, response){
    
}

async function saveNum(submissionType,  contestName,userId, questionLocation, answer){
    if(answer == "")
    answer = null

    await set(submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/answer",
        answer
    )
}
function copyFileWithNewName(originalFile, newFileName) {
  const blobCopy = new Blob([originalFile], { type: originalFile.type });

  const fileCopy = new File([blobCopy], newFileName, { type: originalFile.type });

  return fileCopy;
}

async function saveDes(submissionType, contestName, userId, questionLocation, files, firstdes){
    //remove 'q' from questionLocation
    let filesToSubmit = []
    let questionNumber = Number(questionLocation.substring(1))
    let subjectiveQuestionNumber = questionNumber - firstdes + 1
    if(files.length == 1){
      //extract file format
      let fileFormat = files[0].name.split('.').pop()
      let fileName = "B" + subjectiveQuestionNumber + "." + fileFormat
      filesToSubmit.push(copyFileWithNewName(files[0], fileName))
    }
    if(files.length > 1){
      for(let i = 0; i < files.length; i++){
        let fileFormat = files[i].name.split('.').pop()
        let fileName = "B" + subjectiveQuestionNumber + "-" + (i+1) + "." + fileFormat
        filesToSubmit.push(copyFileWithNewName(files[i], fileName))
      }
    }

    const snapshot = await set(submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/images/", null)
    const storage = getStorage();
    var storageRef
    const tempFiles = []
    let pushToDataBase = []

  const uploadPromises = filesToSubmit.map((file, i) => {
    const storageRef = firebaseStorageRef(storage, submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/" + file.name);

    return uploadBytes(storageRef, file).then(async (snapshot) => {
      tempFiles.push(file);

      // Assuming set is an asynchronous function, wrap it in a Promise
      return new Promise((resolve, reject) => {
        set(submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/images/" + i,
          submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/" + file.name
        )
        .then(() => resolve())
        .catch((error) => reject(error));
      });
    });
  });

try {
  await Promise.all(uploadPromises);
  console.log('All files uploaded successfully.');
} catch (error) {
  console.error('Error uploading files:', error);
}
}

export {saveScMc, saveDes, saveMc, saveNum}