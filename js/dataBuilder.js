// Pius Wong
// This JS file is for parsing the raw JSON sentence data into a
// tree structure JSON that can be accessed by the main JS files more easily.

// Read in raw JSON -- done in HTML before this as: var rawData
// Count number of sentences = NS
var numSentences = rawData.length;
// Initialize new JSON with data parsed into tree structure, with nested objects
//var wordsAll = {"A": {"word": "it", "order": 1}, "B": {"word": "You", "order": 1}};  // DEBUG test input
var wordsAll = {};
// LOOP1 (stop if s>S)
for(let indexS=0; indexS<1; indexS++){  //DEBUG change end condition later
  // Read in sentence (index s)
  var currentSentence = rawData[indexS].sentence;
  // Split sentence into array of words according to spaces
  var currentWords = currentSentence.split(" ");
  // count number of words N
  var numWords = currentWords.length;
  // Remove certain punctuation from elements: .,!?  (but not -'/_)
  currentWords = removePunctuation(currentWords);
  // Set 1st layer of the new JSON as the working layer (reset search)
  var workingLayer = wordsAll;
  // RECURSIVE FUNCTIONS to populate one branch of new JSON tree w/ sentence
    // Take single word from sentence array at index (or next index)
    currentOrder = 0; // DEBUG change this index later when looping
    var currentWord = currentWords[currentOrder];
    // Count how many words are already in this working layer of JSON (nChoices)
    var nChoices = countElementsInObject(workingLayer);
    // Check if word is already found in the working layer of the new JSON
    var wordFound = checkIfWordPresent(currentWord,workingLayer,nChoices);
    if(wordFound===false){
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
      console.log(workingLayer[propertyName]); // DEBUG
      // If this is not the last word of the sentence (n !== N):
      if(currentOrder<(numWords-1)){
        // set empty "next" object as the new working layer in the new JSON
        workingLayer[propertyName].next = {};
      }
      // If this is the last word (n === N):
      else if(currentOrder===(numWords-1)){
        // add the terminal tree branch obj properties:
        workingLayer["numWords"] = numWords;
        workingLayer.numHits = rawData[indexS].numHits;
        workingLayer.link = rawData[indexS].link;
        workingLayer.recordYear = rawData[indexS].recordYear;
        workingLayer.accessYear = rawData[indexS].accessYear;
        workingLayer.accessMonth = rawData[indexS].accessMonth;
        workingLayer.sentence = rawData[indexS].sentence;
      }
    }
    // If word is found in new JSON already in the working layer:
      // go to found word object and set its "next" object as the working layer
    // Go to next word in the sentence (n+1); go back to LOOP2
  // Go to next sentence (s+1); go back to LOOP1
}
// output size of JSON in bytes to check
console.log(wordsAll); // DEBUG

// Display anything to check
var HTMLgeneric = '<br\><b>%data%</b>';
var outputData = HTMLgeneric.replace("%data%",currentSentence
  + "<br\>" + "words: " + currentWords
  + "<br\>" + " numWords: " + numWords);
$(".debugOutput").append([outputData]);

// Function to clean up punctuation and spaces in a sentence
function removePunctuation(wordArray){
  var punctuationUndesired = [".", ",", "!", "?"];
  for (let i=0; i<wordArray.length; i++){ // look through each word`
    for (let j=0; j<punctuationUndesired.length; j++){ // look for each punctuation
      wordArray[i] = wordArray[i].replace(punctuationUndesired[j],"");
    }
    // Replace _ with a space
    wordArray[i] = wordArray[i].replace("_"," ");
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
    let existingWordProperty = String.fromCharCode(elem+65);
    if(wordToCheck.toLowerCase()===objSetOfWords[existingWordProperty].word.toLowerCase()){
      wordFound = true;
      break;
    }
  }
  return wordFound;
}
