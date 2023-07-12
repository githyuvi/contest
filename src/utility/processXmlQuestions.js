export async function parseXMLFile(fileURL) {
  try {
    const response = await fetch('src/assets/'+fileURL);
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    return getQuestions(xmlDoc);
  } catch (error) {
    console.error('Error parsing XML file:', error);
    throw error;
  }
}

function getQuestions(xmlDoc) {
  var questionObjects = [];
  const questions = xmlDoc.getElementsByTagName('question');
  const questionsArray = Array.from(questions);
  questionsArray.forEach(question => {
    const questionText = question.getElementsByTagName('text')[0].childNodes[0].nodeValue;
    const options = question.getElementsByTagName('option');
    const optionsArray = Array.from(options);
    const optionsText = optionsArray.map(option => option.childNodes[0].nodeValue);
    const correctAnswer = question.getElementsByTagName('correctAnswer')[0].childNodes[0].nodeValue;
    const questionType = question.getElementsByTagName('type')[0].childNodes[0].nodeValue;
    const questionOrder = question.getElementsByTagName('order')[0].childNodes[0].nodeValue;
    const questionMarks = question.getElementsByTagName('marks')[0].childNodes[0].nodeValue;
    var questionObject = {
      questionText,
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

