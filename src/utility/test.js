const  axios  = require("axios")
const DOMParser = require('xmldom').DOMParser;

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
          questionParts.push({i: {text: childTag.childNodes[0].nodeValue}})
        }
        if(childTag.tagName === 'image') {
          questionParts.push({i: {image: childTag.childNodes[0].nodeValue}})
        }
      }
      const options = question.getElementsByTagName('option');
      const optionsArray = Array.from(options);
      const optionsText = optionsArray.map(option => option.childNodes[0].nodeValue);
      const correctAnswer = question.getElementsByTagName('correctAnswer')[0].childNodes[0].nodeValue;
      const questionType = question.getElementsByTagName('type')[0].childNodes[0].nodeValue;
      const questionOrder = question.getElementsByTagName('order')[0].childNodes[0].nodeValue;
      const questionMarks = question.getElementsByTagName('marks')[0].childNodes[0].nodeValue;
      var questionObject = {
        questionParts,
        optionsText,
        correctAnswer,
        questionType,
        questionOrder,
        questionMarks
      };
      questionObjects.push(questionObject);
    });
    return questionObjects;
  }

// try {
//     // const uid = request.auth.uid;
//     const xmlString = ""
//     logger.info('xmlString', xmlString)
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
//     const xmlJson = getQuestions(xmlDoc);
//     await axios.put('https://fir-algomuse-default-rtdb.asia-southeast1.firebasedatabase.app/contest/' + uid + '.json?auth=XqbLFwUKZuqoq8PRfGC1tpDqZxwOJVN92jrQgEYL', { "questions" : xmlJson })
//   } catch (error) {
//     console.error('Error parsing XML file:', error);
//     throw error;
//   }
async function main(){
  try {
    const response = await fetch('/Users/yuvi/Downloads/Intern/IISc/internships/firebase_app/CNI-Vue/src/utility/questions.xml');
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return getQuestions(xmlDoc);
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
}
main().then((result) => {console.log("success")})