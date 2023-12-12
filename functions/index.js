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

const getUsersWithContestAccess = async () => {
  var usersWithContestAccess
  const resultData = await axios.get('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/contestaccess.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL' )
  logger.info('resultData', resultData.data)
  usersWithContestAccess = Object.values(resultData.data)
  return usersWithContestAccess
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
  const questionsArray = Array.from(questions);
  questionsArray.forEach(question => {
    const questionContent = question.getElementsByTagName('questionContent')[0];
    logger.info('questionContent', questionContent)
    const childTags = questionContent.getElementsByTagName("*");
    logger.info('childTags', childTags)
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
    let optionsText
    let correctAnswer
    if(questionType != 'des'){
      const options = question.getElementsByTagName('option');
      const optionsArray = Array.from(options);
      optionsText = optionsArray.map(option => option.childNodes[0].nodeValue);
      correctAnswer = question.getElementsByTagName('correctAnswer')[0].childNodes[0].nodeValue;
    }
    
    const questionOrder = question.getElementsByTagName('order')[0].childNodes[0].nodeValue;
    const questionMarks = question.getElementsByTagName('marks')[0].childNodes[0].nodeValue;
    if(questionType == 'des'){
    var questionObject = {
      questionParts,
      questionType,
      questionOrder,
      questionMarks
    };
  }
  else {
    var questionObject = {
      questionParts,
      optionsText,
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
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.getPollResults = onCall({cors: true},async (data,context) => {
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

exports.processXmlQuestions = onCall({cors: true},async (request) => {
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

exports.getContestQuestions = onCall({cors: true},async (request) => {
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
    return contestQuestions.data.questions
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
})

exports.checkContestAccess = onCall({cors: true},async (request) => {
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
