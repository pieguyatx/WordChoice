// Pius Wong
// This is the main program.  It should access the tree object "wordsAll"
// that has all the possible word paths to choose from.

// Show persistent data
  // game title/subtitle, date updated,
  // authorship, version, contact info
  // instructions
  // START OVER button
    // constant mouse listener (keyboard option?)
  // ??history / high scores? / achievements? badges?

// Offer the initial choices
  // Read in possible choices from word tree
  // Display choices randomly in the appropriate area
  //var choices = ["ChoiceA","ChoiceBisareallylongword","ChoiceC","ChoiceD"]; //DEBUG
  var numChoices = countElementsInObject(wordsAll);
  var choices = [];
  var arrayOrder = [];
  for(let i=0; i<numChoices; i++){
    let propertyName = String.fromCharCode(i+65);
    choices[i] = wordsAll[propertyName].word; // get word choices
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

// Respond to choice -- LOOP
  // Read in user choice
  for(let i=0; i<numChoices; i++){
    $(".choice"+i).click(function(){
      //alert("The paragraph for choice"+i+" was clicked."); // DEBUG
      // Save word choice
      var chosenWord = choices[i];
      // Display word choice in appropriate place
      $(".messageDisplay").append(chosenWord);
      // Clear screen of old choices
      $(".mainWindow").empty();
    });
  }

  // Find whether there are any more choices or not
    // Load up next choices (LOOP back) OR
    // go on to "end" state, passing final data in tree branch terminus

// Display end state
  // show final sentence
  // display link to internet
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
