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

async function saveDes(submissionType, contestName, userId, questionLocation, files){
    const snapshot = await set(submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/images/", null)
    const storage = getStorage();
    var storageRef
    const tempFiles = []
    let pushToDataBase = []
    for (let i = 0; i < files.length; i++) {
      storageRef = firebaseStorageRef(storage, submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/" + files[i].name);
      await uploadBytes(storageRef, files[i]).then(async (snapshot) => {
        tempFiles.push(files[i])
        // pushToDataBase.push = props.submissionType + "contestsubmission/" + props.contestName + "/" + userId.value + "/" + "answers/" + props.questionLocation + "/" + files[i].name
        await set(submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/images/" + i,
        submissionType + "contestsubmission/" + contestName + "/" + userId + "/" + "answers/" + questionLocation + "/" + files[i].name
      )
      })
        .catch((error) => {
          console.log(error.message);
        });
}
}

export {saveScMc, saveDes, saveMc, saveNum}
//nrpchl7, kandharaja@iiitdm.ac.in