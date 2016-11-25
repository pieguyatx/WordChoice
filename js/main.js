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
  for(let i=0; i<numChoices; i++){
    let propertyName = String.fromCharCode(i+65);
    choices[i] = wordsAll[propertyName].word;
  }
  for(let i=0; i<numChoices; i++){
    let outputData = choices[i];
    let choiceContainer = "<div class='choice"+i+"'>%data%</div>";
    outputData = choiceContainer.replace("%data%",outputData);
    $(".mainWindow").append([outputData]);
  }
    // animate?

// Respond to choice -- LOOP
  // Read in user choice
  for(let i=0; i<numChoices; i++){
    $(".choice"+i).click(function(){
      alert("The paragraph for choice"+i+" was clicked.");
    });
  }

  function myFunctionMouseDown(elmnt, clr) {
      elmnt.style.color = clr;
  }
  // Save word choice
  // Display word choice in appropriate place
  // Clear screen of old choices
  // Find whether this is the end of the sentence or not
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
