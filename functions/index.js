/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall, onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const  axios  = require("axios")
const DOMParser = require('xmldom').DOMParser;
const ALLOWED_ORIGINS = [process.env.ALLOWED_ORIGIN1, process.env.ALLOWED_ORIGIN2, process.env.ALLOWED_ORIGIN3, process.env.ALLOWED_ORIGIN4]
const BASE_URL = process.env.BASE_URL
const AUTH = process.env.AUTH

const getUsersWithContestAccess = async () => {
  var usersWithContestAccess
  const resultData = await axios.get(BASE_URL + '/contestaccess.json?' + AUTH )
  logger.info('resultData', resultData.data)
  usersWithContestAccess = Object.values(resultData.data)
  return usersWithContestAccess
}

const hasAdminAccess = async(uid) => {
  let flag = false
  var adminUsers
  const resultData = await axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/adminaccess.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL' )
  adminUsers = Object.values(resultData.data)
  for(let i=0;i<adminUsers.length;i++) {
    if(adminUsers[i] === uid) {
      flag = true;
      break;
    }
  }
  return flag;
}

const hasEvaluationAccess = async(uid,scores,studentId,contestName) => {
  logger.info('evaluation access check')
  let flag = false
  const resultData = await axios.get(BASE_URL + '/evaluationaccess/' + uid + '/' + contestName + '/studentIds.json?' + AUTH )
  const studentUsers = resultData.data
  console.log('length', studentUsers.length)
  console.log('studentUsers', studentUsers)
  console.log('studentId', studentId)
  if(studentUsers == null) return false;
  for(let i=0;i<studentUsers.length;i++) {
    if(studentUsers[i] === studentId) {
      logger.info('student id  present')
      flag = true;
      break;
    }
  }
  const resultData2 = await axios.get(BASE_URL + '/evaluationaccess/' + uid + '/' + contestName + '/questionNumbers.json?' + AUTH )
  const questionsHaveAccess = resultData2.data
  if(questionsHaveAccess == null) return false;

  console.log('scores', scores)
  const questionToBeUpdated = Object.keys(scores["subjective"])
  logger.info('questiontobeupdated', questionToBeUpdated)

  for(let i = 0;i<questionToBeUpdated.length;i++){
    questionToBeUpdated[i] = parseInt(questionToBeUpdated[i])
  }

  for(let i = 0;i<questionToBeUpdated.length;i++){
    if(!questionsHaveAccess.includes(questionToBeUpdated[i])){
      flag = false
      break
    }
  }
  return flag;
}

// Define the required scopes.
var scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/firebase.database"
];

const computeStats = (polldata) => {
    var total1 = 0
    var total2 = 0
    const options1 = [
        ['15 or less',0],
        ['16 - 20',0],
        ['21 - 25',0],
        ['26 - 30',0],
        ['31 - 40',0],
    ]
    const options2 = [
        ['0 - 10',0],
        ['11 - 20',0],
        ['21 - 30',0],
        ['31 - 40',0],
        ['41 - 50',0],
        ['51 - 60',0],
        ['61 - 70',0],
        ['71 - 80',0],
    ]
    const length = polldata.length
    for(let i = 0;i<length;i++) {
        var q1 = parseInt(polldata[i].q1)
        var q2 = parseInt(polldata[i].q2)

        options1[q1-1][1]++
        total1++
        options2[q2-1][1]++
        total2++
        
    }

    return {
        options1: options1,
        options2: options2,
        total1: total1,
        total2: total2,
    }
}

function getQuestions(xmlDoc) {
  var questionObjects = [];
  const questions = xmlDoc.getElementsByTagName('question');
  console.log('question length', questions.length)
  const questionsArray = Array.from(questions);

  questionsArray.forEach((question,index) => {
    const questionContent = question.getElementsByTagName('questionContent')[0];
    const childTags = questionContent.getElementsByTagName("*");
    var questionParts = []
    for (let i = 0; i < childTags.length; i++) {
      const childTag = childTags[i];
      // Perform operations on each child tag
      if(childTag.tagName === 'text') {
        questionParts.push({text: childTag.childNodes[0].nodeValue})
      }
      if(childTag.tagName === 'image') {
        questionParts.push({image: childTag.childNodes[0].nodeValue})
      }
    }
    const questionType = question.getElementsByTagName('type')[0].childNodes[0].nodeValue;
    let optionsArray = []
    let correctAnswer = []
    if(questionType != 'des' && questionType != 'num'){
      const options = question.getElementsByTagName('option');
      for(let i = 0;i< options.length;i++){
        let optionElement = options[i]
        let optionParts = []
        const optionChildTags = optionElement.getElementsByTagName("*");
        for (let i = 0; i < optionChildTags.length; i++) {
          const optionChildTag = optionChildTags[i];
          // Perform operations on each child tag
          if(optionChildTag.tagName === 'text') {
            optionParts.push({text: optionChildTag.childNodes[0].nodeValue})
          }
          if(optionChildTag.tagName === 'image') {
            optionParts.push({image: optionChildTag.childNodes[0].nodeValue})
          }
        }
        optionsArray.push(optionParts)
      }
      
      // correctAnswer = question.getElementsByTagName('correctAnswer')[0].childNodes[0].nodeValue;
      let correctAnswerTags = question.getElementsByTagName('correctAnswer');
      for(let i = 0;i<correctAnswerTags.length;i++){
        correctAnswer.push(correctAnswerTags[i].childNodes[0].nodeValue)
      }
    }
    let correctAnswerLower;
    let correctAnswerUpper;

    if(questionType == 'num'){
      
      let correctAnswerLowerTags = question.getElementsByTagName('correctAnswerLower');
      correctAnswerLower = correctAnswerLowerTags[0].childNodes[0].nodeValue

      let correctAnswerUpperTags = question.getElementsByTagName('correctAnswerUpper');
      correctAnswerUpper = correctAnswerUpperTags[0].childNodes[0].nodeValue
    }
    
    
    const questionOrder = index + 1
    const questionMarks = question.getElementsByTagName('marks')[0].childNodes[0].nodeValue;
    if(questionType == 'des'){
    var questionObject = {
      questionParts,
      questionType,
      questionOrder,
      questionMarks
    };
  }
  else if(questionType == 'num'){
    var questionObject = {
      questionParts,
      correctAnswerLower,
      correctAnswerUpper,
      questionType,
      questionOrder,
      questionMarks
    };
  }
  else {
    var questionObject = {
      questionParts,
      optionsArray,
      correctAnswer,
      questionType,
      questionOrder,
      questionMarks
    };
  }
    questionObjects.push(questionObject);
  });
  return questionObjects;
}

exports.getPollResults = onCall({cors: ALLOWED_ORIGINS},async (data,context) => {
    var responseData = {}
      await axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/poll.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL' ).then((result) => {
                const resultdata = Object.values(result.data)
                console.log("result" + result)
                console.log("resultdata" + resultdata)
                responseData = computeStats(resultdata)
            }).catch((error) => {
                console.log('insideAxiosError')
                console.log(error)
            })
            
            // return responseData
            // context.send({
            //     responseData
            // })
            return {responseData}    
});

exports.processXmlQuestions = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {

    const uid = request.auth.uid;
    var flag = false;
    const usersArray = await getUsersWithContestAccess()
    for(var i=0;i<usersArray.length;i++) {
      if(usersArray[i] === uid) {
        flag = true;
        break;
      }
    }
    if(!flag) {
      return {
        status: 'error',
        message: 'You do not have access to this contest'
      }
    }
    const xmlString = request.data.xmlString
    const xmlStringReplaced = xmlString.replace(/<br>/g, '\n');
    const contestName = request.data.contestName
    const contestType = request.data.contestType
    var baseUrl
    if(contestType === 'democontest') 
      baseUrl = 'https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/democontest/' + uid + '/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL'
    if(contestType === 'livecontest') 
      baseUrl = 'https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/livecontest/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL'
    logger.info('xmlString', xmlString)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStringReplaced, 'text/xml');
    const xmlJson = getQuestions(xmlDoc);
    await axios.put(baseUrl, { "questions" : xmlJson })
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
});

exports.getContestQuestions = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {
    const uid = request.auth.uid;
    const contestName = request.data.contestName
    const contestType = request.data.contestType
    var baseUrl
    if(contestType === 'democontest') 
      baseUrl = 'https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/democontest/' + uid + '/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL'
    if(contestType === 'livecontest') 
      baseUrl = 'https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/livecontest/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL'
    const contestQuestions = await axios.get(baseUrl)
    // return everything except correctAnswer
    const questions = contestQuestions.data.questions
    for(let i = 0;i<questions.length;i++){
      delete questions[i].correctAnswer
    }
    return questions
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
})

exports.checkContestAccess = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {
    const uid = request.auth.uid;
    var flag = false;
    const usersArray = await getUsersWithContestAccess()
    for(var i=0;i<usersArray.length;i++) {
      if(usersArray[i] === uid) {
        flag = true;
        break;
      }
    }
    return flag
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
})

exports.getCorrectAnswers = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {
    const uid = request.auth.uid;
    var flag = false;
    const contestName = request.data.contestName
    const contestData = axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/livecontest/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL')
    const usersArray = await getUsersWithContestAccess()
    for(var i=0;i<usersArray.length;i++) {
      if(usersArray[i] === uid) {
        flag = true;
        break;
      }
    }
    return flag
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
})

exports.getContests = onCall( {cors: ALLOWED_ORIGINS },async (request) => {
  try {
    const uid = request.auth.uid;
    const hasAccess = await hasAdminAccess(uid)
    if(hasAccess){
      const contests = await axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/livecontest.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL')
      return contests.data
    }
    else {
      return {
        status: 'error',
        message: 'You do not have access to this page'
      }
    }
  } catch (error) {
    console.error('Error ', error);
    throw error;
  }
})

// exports.getUserSubmissions = onCall({cors: ALLOWED_ORIGINS},async (request) => {
//   try {
//     const uid = request.auth.uid;
//     var baseUrl
//     if(contestType === 'democontest') 
//       baseUrl = 'https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/democontest/' + uid + '/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL'
//     if(contestType === 'livecontest') 
//       baseUrl = 'https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/livecontest/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL'
//     const contestQuestions = await axios.get(baseUrl)
//     return contestQuestions.data.questions
//   } catch (error) {
//     console.error('Error parsing XML file:', error);
//     throw error;
//   }
// })

exports.getEvaluators = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {
    const uid = request.auth.uid;
    const hasAccess = await hasAdminAccess(uid)
    if(hasAccess){
      const evaluators = await axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/evaluators.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL')
      return evaluators.data
    }
    else {
      return {
        status: 'error',
        message: 'You do not have access to this page'
      }
    }
  } catch (error) {
    console.error('Error ', error);
    throw error;
  }
})

exports.getContestSubmissions = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {
    const uid = request.auth.uid;
    const contestName = request.data.contestName
    const hasAccess = await hasAdminAccess(uid)
    if(hasAccess){
      const contestSubmissionData = await axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/livecontestsubmission/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL')
      return contestSubmissionData.data
    }
    else {
      return {
        status: 'error',
        message: 'You do not have access to this page'
      }
    }
  } catch (error) {
    console.error('Error ', error);
    throw error;
  }
})

exports.setEvaluationAccess = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {
    const uid = request.auth.uid;
    const hasAccess = await hasAdminAccess(uid)
    if(hasAccess){
      const evaluatorId = request.data.evaluatorId
      const contestName = request.data.contestName
      const questionNumbers = request.data.questionNumbers
      const studentIds = request.data.studentIds
      await axios.put('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/evaluationaccess/' + evaluatorId + '/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL',
      {"questionNumbers": questionNumbers, "studentIds":studentIds})
      return {
        status: 'success',
        message: 'successfully done'
      }
    }
    else {
      return {
        status: 'error',
        message: 'You do not have access to this page'
      }
    }
  }
  catch (error) {
    console.error('Error ', error);
    throw error;
  }
})

exports.getAnswersForEvaluation = onCall({cors: ALLOWED_ORIGINS},async (request) => {
  try {
    const uid = request.auth.uid;
    let returnData = {}
    const answersForEvaluationData = await axios.get(BASE_URL + '/evaluationaccess/' + uid + '.json?' + AUTH)
    if( answersForEvaluationData.data != null) {
      const answersForEvaluation = answersForEvaluationData.data
      const keys = Object.keys(answersForEvaluation)
      const values = Object.values(answersForEvaluation)
      const answersForEvaluationArray = []

      for(let i=0;i<keys.length;i++) {
        const contestName = keys[i]
        const questionNumbers = values[i].questionNumbers
        const studentIds = values[i].studentIds
        const answersForEvaluationObject = {
          contestName,
          questionNumbers,
          studentIds,
        }
        answersForEvaluationArray.push(answersForEvaluationObject)
      }
      logger.info('answersForEvaluationArray', answersForEvaluation)
      for(let i = 0;i<answersForEvaluationArray.length;i++){
        let cN = answersForEvaluationArray[i].contestName
        let qN = Object.values(answersForEvaluationArray[i].questionNumbers)

        let studentArray = Object.values(answersForEvaluationArray[i].studentIds)
        
        const userIdObjects = {}
        for(let j = 0;j<studentArray.length;j++){
          const studentAnswersData = await axios.get(BASE_URL + '/livecontestsubmission/' + cN + '/' + studentArray[j] + '/answers.json?' + AUTH)
          const studentAnswers = studentAnswersData.data
          logger.info('studentAnswers', studentAnswers)
          const questionAnswerObject = {}
          for(let k = 0;k<qN.length;k++){
            const questionNumber = qN[k]
            const questionAnswer = studentAnswers['q' + questionNumber] || 'not submitted'
            questionAnswerObject[questionNumber] = questionAnswer
          }
          userIdObjects[studentArray[j]] = questionAnswerObject
        }
        returnData[cN] = userIdObjects
        
        
      }

      return returnData
    }
    else {
      return {
        status: 'error',
        message: 'You do not have access to this page'
      }
    }
  } catch (error) {
    console.error('Error ', error);
    throw error;
  }
})

exports.updateScore = onCall({cors: ALLOWED_ORIGINS}, async(request) => {
  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
  
    const arr1Set = new Set(arr1);
    const arr2Set = new Set(arr2);
  
    for (const item of arr2Set) {
      if (!arr1Set.has(item) || arr2Set.size !== arr1Set.size) {
        return false;
      }
    }
  
    return true;
  }
  var questionObjects = []
  let correctAnswers = {}
  let userResponse = {}
  let scores = {
    objective: {},
    subjective: {}
  }
  let totalScore = {value: 0}
  try {
    const uid = request.auth.uid;
    const contestName = request.data.contestName
    let index = 0;

    let baseUrl = 'https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/livecontest/' + contestName + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL'
    const contestQuestions = await axios.get(baseUrl)
    questionObjects = contestQuestions.data.questions
    logger.info('question Objects', questionObjects)
      questionObjects.forEach(question => {
        if(question.questionType == 'num'){
          correctAnswers[++index] = [parseFloat(question.correctAnswerLower), parseFloat(question.correctAnswerUpper)]
        }
        else
        correctAnswers[++index] = question.correctAnswer;
      });

    if(questionObjects){
      for (let i = 0; i < questionObjects.length; i++) {
        
        let questionNumber = i + 1
        await axios.get(BASE_URL + '/livecontestsubmission/' + contestName + '/' + uid + "/" + `answers/q` + questionNumber + ".json?" + AUTH)
          .then(async (snapshot) => {
            if (snapshot.data) {
              const userAnswers = snapshot.data;
              if(userAnswers["options"] != null)
              userResponse[questionNumber] = userAnswers["options"]
              else if(userAnswers["images"] != null)
              userResponse[questionNumber] = userAnswers["images"]
              else if(userAnswers["answer"] != null)
              userResponse[questionNumber] = parseFloat(userAnswers["answer"])
              else
              userResponse[questionNumber] = null


            }
            else {
              userResponse[questionNumber] = null
            }
            
    
          })
          .catch((error) => {
            console.log(error);
            alert("couldn't fetch results");
          });
    
      }
    }
    let length = questionObjects.length
    // Loop through userResponse keys (question numbers)
    for (let i = 1;i<=length;i++) {
      let questionNumber = i
      const userAnswer = userResponse[questionNumber];
      const correctAnswer = correctAnswers[questionNumber];
      let questionType = questionObjects[questionNumber - 1].questionType
      let a
        if(questionType == "des")
        a = "subjective"
        else
        a = "objective"
        if(userAnswer == null){
          scores[a][questionNumber] = "not submitted"
          continue
        }
        else if(correctAnswer == null) {
          scores[a][questionNumber] = "not evaluated"
          continue
        }
      // Check if the user response matches the correct answer
      if (questionType == 'mc' || questionType == 'mcd') {
        // If the user response is an array (for multiple choice), check every element
        if (arraysEqual(userAnswer, correctAnswer)) {
          scores[a][questionNumber] = questionObjects[questionNumber - 1].questionMarks
          totalScore.value += parseInt(questionObjects[questionNumber - 1].questionMarks)
        }
        else {
          scores[a][questionNumber] = 0
        }
        

      } 

      else if(questionType == 'num'){
        if(userAnswer >= correctAnswer[0] && userAnswer <= correctAnswer[1]){
          scores[a][questionNumber] = questionObjects[questionNumber - 1].questionMarks
          totalScore.value += parseInt(questionObjects[questionNumber - 1].questionMarks)
        }
        else {
          scores[a][questionNumber] = 0
        }

      }
      
      else {
        // If the user response is a string (for single choice), compare directly
        if (userAnswer === correctAnswer[0]) {
          scores[a][questionNumber] = questionObjects[questionNumber - 1].questionMarks
          totalScore.value += parseInt(questionObjects[questionNumber - 1].questionMarks)
        }
        else {
          scores[a][questionNumber] = 0
        }
      }
    }

    await axios.put(BASE_URL + '/scores/' + contestName + '/' + uid + ".json?" + AUTH, {scores})

    
  } catch (error) {
    console.error('Error ', error);
    throw error;
    
  }
})

exports.updateEvaluatedScore = onCall({cors: ALLOWED_ORIGINS}, async(request) => {
  try {
    const uid = request.auth.uid;
    const contestName = request.data.contestName
    const studentId = request.data.studentId
    const score = request.data.score
    const hasAccess = await hasEvaluationAccess(uid, score, studentId, contestName)
    console.log('score subjective', score["subjective"])
    if(hasAccess){
      await axios.patch(BASE_URL + '/scores/' + contestName + '/' + studentId + "/scores/subjective.json?" + AUTH, score["subjective"])
      return {
        status: 'success',
        message: 'successfully done'
      }
    }
    else {
      return {
        status: 'error',
        message: 'You do not have access to this page'
      }
    }

  }
  catch (error) {
    console.error('Error ', error);
    throw error;
    
  }
})

// function to fetch all scores
exports.getAllScores = onCall({cors: ALLOWED_ORIGINS}, async(request) => {
  try {
    const uid = request.auth.uid;
    const contestName = request.data.contestName
      const scores = await axios.get(BASE_URL + '/scores/' + contestName + '.json?' + AUTH)
      return scores.data
    

  }
  catch (error) {
    console.error('Error ', error);
    throw error;
    
  }
})

exports.getImages = onCall({cors: ALLOWED_ORIGINS}, async(request) => {
  try {
    const uid = request.auth.uid;
    const contestName = request.data.contestName
    const studentId = request.data.studentId
    const questionNumber = request.data.questionNumber
    const images = await axios.get(BASE_URL + '/livecontestsubmission/' + contestName + '/' + studentId + "/answers/q" + questionNumber + "/images.json?" + AUTH)
    return images.data
  
  }
  catch (error) {
    console.error('Error ', error);
    throw error;
    
  }
})













