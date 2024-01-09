// Note: This file contains a function that parses latex strings
export function parseLatex(inputString) {
    // Using regular expressions to replace \( and \) with $$
    // let replacedString = inputString.replace(/\\\(/g, '$$').replace(/\\\)/g, '$$');
    let replacedString = inputString.replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$').replace(/\\\(/g, '$$').replace(/\\\)/g, '$$')
    // console.log(replacedString)
    return replacedString;
}


