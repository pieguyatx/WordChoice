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
  $(".achievements").empty();
  $(".achievements").append("ACHIEVEMENTS");
});

// Set initial choices
offerChoices(wordsAll);
// Set initial score(s)
var scoreHigh = 0;
$("#scoreHigh").append(scoreHigh);

// Load up next choices (LOOP back) OR
// go on to "end" state, passing final data in tree branch terminus
// Use cookies to record score, sentences, history, etc???

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
      // [Are there more choices coming?, If not what's the ending info?]
      var outputCheckForNext = checkForNext(objWordChoices[chosenProperty]);
      if(outputCheckForNext[0]){
        // Read in the next set of choices for next cycle in while loop
        offerChoices(objWordChoices[chosenProperty].next);
      }
      else{
        //console.log(outputCheckForNext[1]); //DEBUG
        endState(outputCheckForNext[1]);
      }
    });
  }
}

// Check if the given chosen word-object is for the last word or not
function checkForNext(obj){
  // Initial decision to show word choices or not
  var moreChoices = true;
  var finalObj = obj;
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
      let outputCheckForNext = checkForNext(obj.next.A);
      moreChoices = outputCheckForNext[0];
      finalObj = outputCheckForNext[1];
    }
  }
  // If no, then this is the last choice and last word. Go to "end" state
  else{
    // Exit initial loop; output that it's the end
    moreChoices = false;
    //console.log(obj.word+": The end is nigh!") // DEBUG
    finalObj = obj;
  }
  //console.log(finalObj); //DEBUG
  return [moreChoices,finalObj];
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
  // Analyze URL qualities
  var outputAnalyzeURL = analyzeURL(objFinal.link);
  var domain = outputAnalyzeURL[0];
  var urlType = outputAnalyzeURL[1];
  var extension = outputAnalyzeURL[2];
  var urlLength = outputAnalyzeURL[3];
  // display link to internet
  $(".messageDisplay").append("<a href='"+objFinal.link+"' target='_blank'>"+domain+"</a>");
  // Calculate score
  var scores =
    calculateScore(objFinal.order,objFinal.numHits,objFinal.recordYear,urlType,extension,urlLength,objFinal.sentence,domain);
  // Score multiplier
  for(let i=0; i<scores.length; i++){
    scores[i] = 10*scores[i];
  }
  // Update score history & achievements -- do this with for loop & array?
  // Update overall score
  if (scores[0] > scoreHigh){
    $("#scoreHigh").empty();
    scoreHigh = scores[0];
    $("#scoreHigh").append(scoreHigh);
  }
  // Display achievements (to be cleared when restarting)
  var msgAchievement=["Overall Score", "Length", "Brevity", "Popularity", "Uniqueness", "History","Newness","Media", "Special Domain", "Complex URL", "Simple URL","Going Blue","Religious"];
  var scoreIds=["sOverall", "sLength", "sBrevity", "sPopularity", "sUniqueness", "sHistory", "sNewness", "sMedia", "surlDomain", "surlComplexity", "surlSimplicity","sGoingBlue","sReligious"];
  for(let i=1; i<scores.length; i++){
    if(scores[i]>0){
      $(".achievements").append("<div class='achievement' id='"+scoreIds[i]+"'>"+msgAchievement[i]+"! +"+scores[i]+"</div>");
    }
  }
  // Give overall score
  $(".achievements").append("<div class='achievement' id='"+scoreIds[0]+"'>"+msgAchievement[0]+": "+scores[0]+"</div>");
  // display witty comment on score? graphic?
  // Save data for achievements
    // Highest score for book
    // Highest score for news
    // Highest score for video
    // Highest score for social media and forums
    // Highest score while going blue
    // Highest score mentioning religion
    // Highest score for .com site
    // Highest score for .edu site
    // Highest score for .mil site
    // Highest score for .org site
    // Highest score for .gov site
    // Highest score for .net site
    // Longest sentence
    // Longest sentence from a book
    // Shortest sentence
    // Shortest sentence from a book
    // oldest year
    // newest year
    // most popular / most number of webhits
    // most unique / least number of webhits
    // Longest URL
    // Shortest URL
  // Thanks for playing
  // display a SHARE button (Twitter, Facebook, Email)
  // emphasize the START OVER button
}

// Calculate a score
function calculateScore(numWords, numHits, year, urlType, extension, urlLength, sentence, domain){
  // Set default scores
  [sOverall, sLength, sBrevity, sPopularity, sUniqueness, sHistory,
    sNewness,sMedia, surlDomain, surlComplexity, surlSimplicity,
    sGoingBlue, sReligious] =
    [10,0,0,0,0,0,0,0,0,0,0,0,0];
  [sLength, sBrevity] = calculateScoreLength(numWords);
  [sPopularity, sUniqueness] = calculateScorePopularity(numHits);
  [sHistory, sNewness] = calculateScoreHistory(year);
  sMedia = calculateScoreMedia(urlType);
  surlDomain = calculateScoreDomain(extension);
  [surlComplexity, surlSimplicity] = calculateScoreURL(urlLength);
  sGoingBlue = calculateScoreGoingBlue(sentence,domain);
  sReligious = calculateScoreReligious(sentence,domain);
  sOverall = sLength + sBrevity + sPopularity + sUniqueness +
    sHistory + sNewness + sMedia + surlDomain + surlComplexity + surlSimplicity +
    sGoingBlue + sReligious;
  return [sOverall, sLength, sBrevity, sPopularity, sUniqueness, sHistory,
    sNewness,sMedia, surlDomain, surlComplexity, surlSimplicity,
    sGoingBlue, sReligious];
}

// Calculate score absed on if sentence or URL has religious word(s)
function calculateScoreReligious(sentence,domain){
  var sReligious = 0;
  var wordsToCheck = ["bible", "church", "temple", "islam", "christian", "mosque", "jesus", "god", "lord", "christ", "catholic", "evangelical", "jew", "judaism"];
  for(let i=0; i<wordsToCheck.length; i++){
    if (sentence.toLowerCase().indexOf(wordsToCheck[i]) != -1){
      // match found; stop searching
      sReligious = 97;
      break;
    }
    if (domain.toLowerCase().indexOf(wordsToCheck[i]) != -1){
      // match found; stop searching
      break;
      sReligious = 95;
    }
  }
  return sReligious;
}

// Calculate score based on if sentence or URL goes blue
function calculateScoreGoingBlue(sentence,domain){
  var sGoingBlue = 0;
  var wordsToCheck = ["sex", "dick", "damn", "shit", " hell ", "fuck", " ass ", "boob", "crap"];
  for(let i=0; i<wordsToCheck.length; i++){
    if (sentence.toLowerCase().indexOf(wordsToCheck[i]) != -1){
      // match found; stop searching
      sGoingBlue = 97;
      break;
    }
    if (domain.toLowerCase().indexOf(wordsToCheck[i]) != -1){
      // match found; stop searching
      sGoingBlue = 95;
      break;
    }
  }
  return sGoingBlue;
}

// Calculate score based on URL length
function calculateScoreURL(urlLength){
  var surlComplexity = 0;
  var surlSimplicity = 0;
  if(urlLength<72){
    if(urlLength<38){surlSimplicity=34;}
    else if(urlLength<56){surlSimplicity=15;}
    else{surlSimplicity=5;}
  }
  else if(urlLength>294){
    if(urlLength>345){surlComplexity=39;}
    else if(urlLength>329){surlComplexity=35;}
    else if(urlLength>312){surlComplexity=30;}
    else{surlComplexity=20;}
  }
  return [surlComplexity, surlSimplicity];
}

// Calcualte score based one URL domain
function calculateScoreDomain(topLevelDomain){
  var surlDomain = 0;
  if(topLevelDomain===".edu"){surlDomain=98;}
  else if(topLevelDomain===".mil"){surlDomain=99;}
  else if(topLevelDomain===".org"){surlDomain=89;}
  else if(topLevelDomain===".gov"){surlDomain=99;}
  else if(topLevelDomain===".net"){surlDomain=98;}
  else if(topLevelDomain===".info"){surlDomain=99;}
  else if(topLevelDomain===".us"){surlDomain=99;}
  else if(topLevelDomain===".uk"){surlDomain=98;}
  return surlDomain;
}

// Calculate score for media type
function calculateScoreMedia(urlType){
  var sMedia = 0; // default for urlType='other'
  if(urlType==="book"){sMedia=80;}
  else if(urlType==="video"){sMedia=90;}
  else if(urlType==="social"){sMedia=87;}
  else if(urlType==="news"){sMedia=94;}
  return sMedia;
}

// Calculate scores for history and newness of sentence
function calculateScoreHistory(year){
  var sHistory = 0;
  var sNewness = 0;
  var currentYear = new Date().getFullYear();
  if(year===currentYear){sNewness=40;}
  else if(currentYear-year===1){sNewness=25;}
  else if(currentYear-year===2){sNewness=5;}
  else if(currentYear-year>9){
    if(year<1800){sHistory=100;}
    else if(year<1850){sHistory=99;}
    else if(year<1900){sHistory=98;}
    else if(year<1950){sHistory=94;}
    else if(year<2000){sHistory=75;}
    else if(year<2005){sHistory=50;}
    else{sHistory=15;}
  }
  return [sHistory, sNewness];
}

// Calculate scores for popularity and uniqueness of sentence
function calculateScorePopularity(numHits){
  var sPopularity = 0;
  var sUniqueness = 0;
  if(numHits>1000){
    if(numHits>10000000){sPopularity=93;}
    else if(numHits>1000000){sPopularity=88;}
    else if(numHits>100000){sPopularity=79;}
    else if(numHits>10000){sPopularity=50;}
    else{sPopularity=10;}
  }
  else if(numHits<100){
    if(numHits<2){sUniqueness=90;}
    else if(numHits<3){sUniqueness=80;}
    else if(numHits<4){sUniqueness=70;}
    else if(numHits<5){sUniqueness=60;}
    else if(numHits<6){sUniqueness=50;}
    else if(numHits<7){sUniqueness=40;}
    else if(numHits<8){sUniqueness=30;}
    else if(numHits<9){sUniqueness=20;}
    else if(numHits<10){sUniqueness=10;}
    else if(numHits<50){sUniqueness=5;}
    else{sUniqueness=3;}
  }
  return [sPopularity, sUniqueness];
}

// Calculate scores for length and brevity of sentence
function calculateScoreLength(numWords){
  var sLength = 0;
  var sBrevity = 0;
  if(numWords<11){
    if(numWords<3){sBrevity=100;}
    else if(numWords<3){sBrevity=95;}
    else if(numWords<5){sBrevity=66;}
    else if(numWords<8){sBrevity=28;}
    else{sBrevity=6;}
  }
  else if(numWords>13){
    if(numWords>38){sLength=97;}
    else if(numWords>35){sLength=96;}
    else if(numWords>32){sLength=94;}
    else if(numWords>27){sLength=91;}
    else if(numWords>24){sLength=90;}
    else if(numWords>21){sLength=79;}
    else if(numWords>18){sLength=69;}
    else if(numWords>16){sLength=61;}
    else{sLength=19;}
  }
  return [sLength, sBrevity];
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
    var urlType = "other"; // default type
    // scan for keywords in the URL to make a best guess
    var urlAssignments = [  // hierarchical; earlier overrides later
        ["youtube","video"],["books.google","book"],
        ["facebook","social"],["forum","social"],["reddit","social"],
        ["twitter","social"],["vimeo","video"],
        ["pinterest","social"],["quora","social"],["answers.yahoo","social"],
        ["blog","blog"],["news","news"],["goodreads","book"],
        ["huffingtonpost","news"],["baltimoresun","news"],["theatlantic","news"],
        ["biblehub","book"],["bloomberg","news"],["amazon.com","book"],
        ["theguardian","news"],["times.com","news"],
      ];
    for(let i=0; i<urlAssignments.length; i++){
      console.log(urlAssignments[i]);
      if (url.toLowerCase().indexOf(urlAssignments[i][0]) != -1){
        // match found; stop searching
        urlType = urlAssignments[i][1];
        break;
      }
    }

    // assign the extension if possible
    var extension = "other"; // default type
    // scan for keywords in the URL to make a best guess
    var extensionAssignments = [
      ".edu", ".mil",".org",".gov",".com",".net",".info",".us",".uk"
    ];
    for(let i=0; i<extensionAssignments.length; i++){
      if (url.toLowerCase().indexOf(extensionAssignments[i]) != -1){
        // match found; stop searching
        extension = extensionAssignments[i];
        break;
      }
    }

    // Find URL length
    var urlLength = url.length;

    return [domain,urlType,extension,urlLength];
}
