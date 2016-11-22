// Pius Wong
// This JS file is for parsing the raw JSON sentence data into a
// tree structure JSON that can be accessed by the main JS files more easily.

// Read in raw JSON -- done in HTML before this as: var rawData
// Count number of sentences = NS
var numSentences = rawData.length;
// Initialize new JSON with data parsed into tree structure, with nested objects
//var wordsAll = {"A": {"word": "it", "order": 1, "next": {"A": {"word": "shall"}}}, "B": {"word": "You", "order": 1, "next": {"A": {}}}};  // DEBUG test input
var wordsAll = {};
// LOOP1 (stop if s>S) S = numSentences read in from raw data
for(var indexS=0; indexS<numSentences; indexS++){  //DEBUG change end condition later
  // Read in sentence (index s)
  var currentSentence = rawData[indexS].sentence;
  // Split sentence into array of words according to spaces
  var currentWords = currentSentence.split(" ");
  // Remove certain punctuation from elements: .,!?"  (but not -'/_)
  currentWords = removePunctuation(currentWords);
  // count number of words N
  var numWords = currentWords.length;
  // Start with first word
  var currentOrder = 0;
  // Populate one branch of new JSON tree w/ sentence (use recursion)
  wordsAll = populateWordTree(wordsAll,currentWords);
  // Go to next sentence (s+1); go back to LOOP1
}

/*
// DEBUG output size of JSON in bytes to check
console.log(wordsAll); // DEBUG
var textOutput = JSON.stringify(wordsAll); // DEBUG
// use this to visualize: http://chris.photobooks.com/json/default.htm
// or this may be better: http://jsonlint.com/

// DEBUG Display anything to check
var HTMLgeneric = '<br\><b>%data%</b>';
var outputData = HTMLgeneric.replace("%data%",currentSentence
  + "<br\>" + "words: " + currentWords
  + "<br\>" + " numWords: " + numWords);
$(".debugOutput").append([outputData]);
*/

// Function to clean up punctuation and spaces in a sentence
function removePunctuation(wordArray){
  var punctuationUndesired = [".", ",", "!", "?"];
  for (let i=0; i<wordArray.length; i++){ // look through each word`
    for (let j=0; j<punctuationUndesired.length; j++){ // look for each punctuation
      wordArray[i] = wordArray[i].replace(punctuationUndesired[j],"");
    }
    // Replace _ with a space
    wordArray[i] = wordArray[i].replace("_"," ");
    /* // Get rid of double quotes (special case)
    wordArray[i] = wordArray[i].replace(/\"/g,""); */  // only if quotes added later
  }
  // Remove any empty elements due to extra spaces around words
  wordArray = wordArray.filter(Boolean);
  return wordArray;
}

// Function to count elements in a generic object
function countElementsInObject(obj){
  var count = 0;
  for(var elem in obj){
    if(obj.hasOwnProperty(elem)){
      count++;
    }
  }
  return count;
}

// Function to check if a word matches existing word in set of words (object)
function checkIfWordPresent(wordToCheck,objSetOfWords,numWordsInSet){
  var wordFound = false;
  for(let elem=0; elem<numWordsInSet; elem++){ // search proper elem (A, B, etc)
    var existingWordProperty = String.fromCharCode(elem+65);
    if(wordToCheck.toLowerCase()===objSetOfWords[existingWordProperty].word.toLowerCase()){
      wordFound = true;
      break;
    }
  }
  // Return whether a match was found, and if so, what the property is (A,B,etc)
  return [wordFound,existingWordProperty];
}

// Function to generate next branch in new JSON tree
// Input an object (node or root), and a list of words from a sentence
function populateWordTree(workingLayer,workingWords){
  // Take single word from sentence array at index (or next index)
  var currentWord = workingWords[currentOrder]; //currentOrder = global var
  // Count how many words are already in this working layer of JSON (nChoices)
  var nChoices = countElementsInObject(workingLayer);
  // Check if word is already found in the working layer of the new JSON
  var wordFound = checkIfWordPresent(currentWord,workingLayer,nChoices);
  if(wordFound[0]===false){
    // If word is not found,
    // add the word to the working layer of the new JSON, as an object:
    // Name the object according to nChoices in this layer already
    // 0 => A (char code 65), 1 => B, 2 => C, etc [open ended?]
    let propertyName = String.fromCharCode(nChoices+65);
    // Define the word object accordingly:
      // A{ word: "....",
      // order: "n",
      // next: {[empty obj to fill later]} }
    workingLayer[propertyName] = {};
    workingLayer[propertyName].word = currentWord;
    workingLayer[propertyName].order = currentOrder+1;
    // If this is not the last word of the sentence (n !== N):
    var nextWorkingLayer = {}; // initialize next layer
    if(currentOrder<(numWords-1)){
      // define empty "next" object in the new word in the new JSON
      workingLayer[propertyName].next = {};
      nextWorkingLayer = workingLayer[propertyName].next;
      // Advance to next word to populate using recursion
      currentOrder++;
      populateWordTree(nextWorkingLayer,workingWords);
    }
    // If this is the last word (n === N):
    else if(currentOrder===(workingWords.length-1)){
      // add the terminal tree branch obj properties:
      workingLayer[propertyName]["numWords"] = numWords;
      workingLayer[propertyName].numHits = rawData[indexS].numHits;
      workingLayer[propertyName].link = rawData[indexS].link;
      workingLayer[propertyName].recordYear = rawData[indexS].recordYear;
      workingLayer[propertyName].accessYear = rawData[indexS].accessYear;
      workingLayer[propertyName].accessMonth = rawData[indexS].accessMonth;
      workingLayer[propertyName].sentence = rawData[indexS].sentence;
    }
  }
  // If word is found in new JSON already in the working layer:
  else if(wordFound[0]===true){
    // go to found word object and set its "next" object as the working layer
    nextWorkingLayer = workingLayer[wordFound[1]].next;
    //console.log(workingLayer[wordFound[1]]); //DEBUG
    // Advance to next word to populate using recursion
    currentOrder++;
    populateWordTree(nextWorkingLayer,workingWords);
  }
  // Output the resulting new object
  return workingLayer;
}
