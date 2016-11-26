// Pius Wong
// This is the main program.  It should access the tree object "wordsAll"
// that has all the possible word paths to choose from.

// Show persistent data
  // game title/subtitle, date updated,
  // authorship, version, contact info
  // instructions
  // START OVER button
$("header").on('click','.startOver',function(){
  $(".messageDisplay").empty();
  $(".mainWindow").empty();
  offerChoices(wordsAll);
});
    // constant mouse listener (keyboard option?)
  // ??history / high scores? / achievements? badges?

// Set initial choices
offerChoices(wordsAll);


// Load up next choices (LOOP back) OR
// go on to "end" state, passing final data in tree branch terminus

// Display end state
// Use cookies to record score, sentences, history, etc???

// ? History / high scores? / Achievements?
// records of sentences/scores that are
// youngest
// oldest
// oldest video
// oldest social
// oldest book
// longest
// shortest
// going blue: has profanity or sex
// mentions God, Lord, or Jesus

// Offer word choices
function offerChoices(objWordChoices){
  // Read in possible choices from word tree
  // Display choices randomly in the appropriate area
  //var choices = ["ChoiceA","ChoiceBisareallylongword","ChoiceC","ChoiceD"]; //DEBUG
  var numChoices = countElementsInObject(objWordChoices);
  var choices = [];
  var arrayOrder = [];
  for(let i=0; i<numChoices; i++){
    let propertyName = String.fromCharCode(i+65);
    choices[i] = objWordChoices[propertyName].word; // get word choices
    arrayOrder[i] = i;  // initialize array to be shuffled later
  }
  // Rearrange display order to be random
  arrayOrder = shuffleArray(arrayOrder);

  for(let i=0; i<numChoices; i++){
    let outputData = choices[i];
    let choiceContainer = "<div class='choice"+i+"'>%data%</div>";
    outputData = choiceContainer.replace("%data%",outputData);
    $(".mainWindow").append([outputData]); // displays choices
    // Reorder the choice according to random shuffle earlier
    $(".choice"+i).css("order",arrayOrder[i]);
  }
  // animate?

  // Respond to choice
  // Read in user choice
  for(let i=0; i<numChoices; i++){
    $(".choice"+i).click(function(){
      // Save word choice
      var chosenWord = choices[i];
      var chosenProperty = String.fromCharCode(i+65);
      // Display word choice in appropriate place
      if(objWordChoices[chosenProperty].order>1){
        chosenWord = " " + chosenWord;
      }
      $(".messageDisplay").append(chosenWord);
      // Clear screen of old choices
      $(".mainWindow").empty();
      // Find whether there are any more choices deeper into the tree
      // Are there more choices coming?
      if(checkForNext(objWordChoices[chosenProperty])){
        // Read in the next set of choices for next cycle in while loop
        offerChoices(objWordChoices[chosenProperty].next);
      }
      else{
        endState(objWordChoices[chosenProperty]);
      }
    });
  }
}

// Check if the given chosen word-object is for the last word or not
function checkForNext(obj){
  // Initial decision to show word choices or not
  var moreChoices = true;
  if(obj.hasOwnProperty("next")){
    // ...is there more than 1 choice in the "next" property?
    if(countElementsInObject(obj.next)>1){
      // If there is more than 1 choice, then display choices like normal
      // Go to initial loop
      moreChoices = true;
      //console.log(obj.word+": There's more than 1 choice here"); // DEBUG
    }
    else if(countElementsInObject(obj.next)===1){
      // If there is only 1 choice, then ask the same questions to the next layer...
      //console.log(obj.word+": No more choices?"); // DEBUG
      // recursive function to set moreChoices DEBUG
      moreChoices = checkForNext(obj.next.A);
    }
  }
  // If no, then this is the last choice and last word. Go to "end" state
  else{
    // Exit initial loop
    moreChoices = false;
    //console.log(obj.word+": The end is nigh!") // DEBUG
  }
  return moreChoices;
}

/** http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


// End State
function endState(objFinal){
  // clear main section - animate?
  $(".messageDisplay").empty();
  $(".mainWindow").empty();
  // show final sentence
  $(".mainWindow").append("<div class='finalSentence'>"+objFinal.sentence+"</div>");
  // display link to internet
  var domain = analyzeURL(objFinal.link);
  $(".messageDisplay").append("<a href='"+objFinal.link+"'>"+domain[0]+"</a>");
  // calculate a score based on:
  // numHits (internet popularity)
  // year written or put on internet (age)
  // media type (video, social, blog, news, etc)
  // number of words in sentence
  // ?past tries
  // ?popularity of click compared to other players?
  // display witty comment on score? graphic?
  // Thanks for playing
  // display a SHARE button (Twitter, Facebook, Email)
  // emphasize the START OVER button
}


// Get Domain and web type
// partly from http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
function analyzeURL(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    // assign a type if possible
    var urlType = "unknown"; // default type
    // scan for keywords in the URL to make a best guess
    var urlAssignments = [  // hierarchical; earlier overrides later
        ["youtube","video"],["books.google","book"],
        ["facebook","social"],["forum","social"],["reddit","social"],
        ["twitter","social"],["vimeo","video"],
        ["pinterest","social"],["quora","social"],["answers.yahoo","social"],
        ["blogger","blog"],["news","news"],["nytimes","news"],
        ["huffingtonpost","news"],["baltimoresun","news"],["theatlantic","news"],
        ["biblehub","book"],["bloomberg","news"]
        [".edu","general .org site"],
        [".org","general .org site"],
        [".com","general .com site"],
      ];
    for(let i=0; i<urlAssignments.length; i++){
      if (url.toLowerCase().indexOf(urlAssignments[i][0]) != -1){
        // match found; stop searching
        urlType = urlAssignments[i][1];
        break;
      }
    }
    console.log("URL Type: " + urlType); // DEBUG
    return [domain,urlType];
}
