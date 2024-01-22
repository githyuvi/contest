import { getDownloadURL, ref as firebaseStorageRef, getStorage } from "firebase/storage"
const storage = getStorage()

// export async function getQuestionData(props, userId, questionParts) {
//     var baseReference
//   if (props.contestType == 'democontest')
//     baseReference = 'democontest/' + userId.value + '/' + props.contestName + '/'
//   if (props.contestType == 'livecontest')
//     baseReference = 'livecontest/' + props.contestName + '/'
  
//   const questionArray = Array.from(Object.values(props.question))[0]
  
//   for (let i = 0; i < questionArray.length; i++) {
//     var objectkey = Object.keys(questionArray[i])[0]

//     if (objectkey == 'text')
//       // questionHtml.value += '<div>' + questionArray[i][objectkey] + '</div>'
//       questionParts.push({"data":questionArray[i][objectkey], "type": "text"})
//     else if (objectkey == 'image') {
//       var imageUrl
//       var pathReference
//       pathReference = firebaseStorageRef(storage, baseReference + questionArray[i][objectkey]);
//       await getDownloadURL(pathReference)
//         .then((url) => {
//           imageUrl = url
//         })
//         .catch((error) => {
//         });
//       // questionHtml.value += '<img style="max-width:98%;max-height:80vh" src="' + imageUrl + '">'
//       questionParts.push({"data":imageUrl, "type":"image"})
//     }
//   }

// }

export async function getQuestionData(contestType, contestName, userId, questionsArray) {
  let questionParts = []
  var baseReference
if (contestType == 'democontest')
  baseReference = 'democontest/' + userId + '/' + contestName + '/'
if (contestType == 'livecontest')
  baseReference = 'livecontest/' + contestName + '/'

// console.log(questionsArray)

// console.log(Object.keys(questionsArray[0])[0])

for (let i = 0; i < questionsArray.length; i++) {
  var objectkey = Object.keys(questionsArray[i])[0]

  if (objectkey == 'text')
    // questionHtml.value += '<div>' + questionArray[i][objectkey] + '</div>'
    questionParts.push({"data":questionsArray[i][objectkey], "type": "text"})
  else if (objectkey == 'image') {
    var imageUrl
    var pathReference
    pathReference = firebaseStorageRef(storage, baseReference + questionsArray[i][objectkey]);
    await getDownloadURL(pathReference)
      .then((url) => {
        imageUrl = url
      })
      .catch((error) => {
      });
    // questionHtml.value += '<img style="max-width:98%;max-height:80vh" src="' + imageUrl + '">'
    questionParts.push({"data":imageUrl, "type":"image"})
  }
}
  return questionParts
}

// export async function getOptionsData(props, userId, options, optionPartsArray) {
//   var baseReference
//   if (props.contestType == 'democontest')
//     baseReference = 'democontest/' + userId.value + '/' + props.contestName + '/'
//   if (props.contestType == 'livecontest')
//     baseReference = 'livecontest/' + props.contestName + '/'

//    // options example [{index: i,
//   //     id: (i + 1).toString(),
//   //     label: optionParts,}]

//   for(let i = 0;i<options.length;i++){
//     const optionsArray = options[i].label
//     let optionParts = []
//     for (let i = 0; i < optionsArray.length; i++) {
//       var objectkey = Object.keys(optionsArray[i])[0]
  
//       if (objectkey == 'text')
//         // questionHtml.value += '<div>' + questionArray[i][objectkey] + '</div>'
//         optionParts.push({"data":optionsArray[i][objectkey], "type": "text"})
//       else if (objectkey == 'image') {
//         var imageUrl
//         var pathReference
//         pathReference = firebaseStorageRef(storage, baseReference + optionsArray[i][objectkey]);
//         await getDownloadURL(pathReference)
//           .then((url) => {
//             imageUrl = url
//           })
//           .catch((error) => {
//           });
//         // questionHtml.value += '<img style="max-width:98%;max-height:80vh" src="' + imageUrl + '">'
//         optionParts.push({"data":imageUrl, "type":"image"})
//       }
//     }
//     optionPartsArray.push({
//       index: options[i].index,
//       id: options[i].id,
//       optionParts: optionParts,
//     })
//   }

export async function getOptionsData(props, userId, options, optionPartsArray) {
  let optionsArray = []
  var baseReference
  if (props.contestType == 'democontest')
    baseReference = 'democontest/' + userId.value + '/' + props.contestName + '/'
  if (props.contestType == 'livecontest')
    baseReference = 'livecontest/' + props.contestName + '/'

   // options example [{index: i,
  //     id: (i + 1).toString(),
  //     label: optionParts,}]

  for(let i = 0;i<options.length;i++){
    const optionsArray = options[i].label
    let optionParts = []
    for (let i = 0; i < optionsArray.length; i++) {
      var objectkey = Object.keys(optionsArray[i])[0]
  
      if (objectkey == 'text')
        // questionHtml.value += '<div>' + questionArray[i][objectkey] + '</div>'
        optionParts.push({"data":optionsArray[i][objectkey], "type": "text"})
      else if (objectkey == 'image') {
        var imageUrl
        var pathReference
        pathReference = firebaseStorageRef(storage, baseReference + optionsArray[i][objectkey]);
        await getDownloadURL(pathReference)
          .then((url) => {
            imageUrl = url
          })
          .catch((error) => {
          });
        // questionHtml.value += '<img style="max-width:98%;max-height:80vh" src="' + imageUrl + '">'
        optionParts.push({"data":imageUrl, "type":"image"})
      }
    }
    optionPartsArray.push({
      index: options[i].index,
      id: options[i].id,
      optionParts: optionParts,
    })
  }

  

}