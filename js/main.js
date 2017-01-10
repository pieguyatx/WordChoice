// Pius Wong
// This is the main program.  It should access the tree object "wordsAll"
// that has all the possible word paths to choose from.

// Show persistent data
  // game title/subtitle, date updated,
  // authorship, version, contact info
  // instructions
  // START OVER button
$("header").on('click','.startOver button',function(){
  $(".messageDisplay").empty();
  $(".mainWindow").empty();
  offerChoices(wordsAll);
  $(".achievements").empty();
  $(".achievements").append("<div class='paper-unclickable'>Achievements:</div>");
  $(".messageDisplay").removeClass("paper-unclickable");
  $(".mainWindow").removeClass("paper-unclickable");
});

// Set initial choices
offerChoices(wordsAll);

// Set initial score(s)
var scoreHigh = 0;
$("#scoreHigh").append(scoreHigh);
var highestScores = {}; // object to store special scores
highestScores.book = 0;
highestScores.news = 0;
highestScores.video = 0;
highestScores.social = 0;
highestScores.blog = 0;
highestScores.blue = 0;
highestScores.religious = 0;
highestScores.com = 0;
highestScores.edu = 0;
highestScores.mil = 0;
highestScores.org = 0;
highestScores.gov = 0;
highestScores.net = 0;
highestScores.longest = 0;
highestScores.longestBook = 0;
highestScores.shortest = 0;
highestScores.shortestBook = 0;
highestScores.oldest = 0;
highestScores.newest = 0;
highestScores.popular = 0;
highestScores.unique = 0;
highestScores.longestURL = 0;
highestScores.shortestURL = 0;

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
    // Randomize which paper aesthetic to display
    let paperChoice = [1,2,3,4,5,6,7];
    paperChoice = shuffleArray(paperChoice);
    let choiceContainer = "<div id='choiceContainer"+i+"'><button class='paper paper"+paperChoice[0]+" choice"+i+"'>%data%</button></div>";
    outputData = choiceContainer.replace("%data%",outputData);
    $(".mainWindow").append([outputData]); // displays choices
    // Reorder the choice according to random shuffle earlier
    $("#choiceContainer"+i).css("order",arrayOrder[i]);
  }
  // animate?

  // Respond to choice
  // Read in user choice
  for(let i=0; i<numChoices; i++){
    $(".choice"+i).click(function(){
      // Save word choice
      var chosenWord = choices[i];
      var chosenProperty = String.fromCharCode(i+65);
      // Display word choice in appropriate place; add ellipses appropriately
      if(objWordChoices[chosenProperty].order>1){
        chosenWord = " " + chosenWord;
        $(".messageDisplay span").remove();
      }
      $(".messageDisplay").append(chosenWord + '<span>...</span>');
      // Add paper aesthetic to message area if it's not blank
      if(objWordChoices[chosenProperty].order===1){
        $(".messageDisplay").addClass("paper-unclickable");
      }
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
  objFinal.sentence = objFinal.sentence.replace("_"," ");
  $(".mainWindow").append("<span><div class='finalSentence'>"+objFinal.sentence+"</div></span>");
  // display a SHARE button (Twitter, Facebook, Email)
  $(".finalSentence").append(
    "<span class='shareButtons'>&nbsp;&nbsp;&nbsp;<a href='https://twitter.com/share' class='twitter-share-button' data-size='large' data-text='&quot;"+objFinal.sentence.substring(0,99)+"...&quot; http://www.piuswong.com/wordchoice/' data-hashtags='WordChoice' data-related='PiosLabs' data-lang='en' data-show-count='false'>Tweet</a><script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script></span>"
  );
  // Add paper aesthetic to final sentence
  $(".mainWindow>span").addClass("paper-unclickable");
  // Analyze URL qualities
  var outputAnalyzeURL = analyzeURL(objFinal.link);
  var domain = outputAnalyzeURL[0];
  var urlType = outputAnalyzeURL[1];
  var extension = outputAnalyzeURL[2];
  var urlLength = outputAnalyzeURL[3];
  // display link to internet
  $(".messageDisplay").append("Source: <a href='"+objFinal.link+"' target='_blank'>"+domain+"</a>");
  // Calculate score
  var scores =
    calculateScore(objFinal.order,objFinal.numHits,objFinal.yearRecorded,urlType,extension,urlLength,objFinal.sentence,domain);
  // Score multiplier
  for(let i=0; i<scores.length; i++){
    scores[i] = 10*scores[i];
  }
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
  // Format paper aesthetic on achievements
  $(".achievement").addClass("paper-unclickable");
  // display witty comment on score? graphic?
  // Display score heading if record pops up for the first time
    if(highestScores.book===0&&((urlType==="book")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score from a Book or Book Site:</div><div class='score' id='scoreBook'></div></div>");
    }
    if(highestScores.news===0&&((urlType==="news")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a News Site:</div><div class='score' id='scoreNews'></div></div>");
    }
    if(highestScores.video===0&&((urlType==="video")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a Video Site:</div><div class='score' id='scoreVideo'></div></div>");
    }
    if(highestScores.social===0&&((urlType==="social")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a Social Media Site:</div><div class='score' id='scoreSocial'></div></div>");
    }
    if(highestScores.blog===0&&((urlType==="blog")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a Blog:</div><div class='score' id='scoreBlog'></div></div>");
    }
    if(highestScores.blue===0&&((scores[11]>0)&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score Going Blue:</div><div class='score' id='scoreBlue'></div></div>");
    }
    if(highestScores.religious===0&&((scores[12]>0)&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for Something Religious:</div><div class='score' id='scoreReligious'></div></div>");
    }
    if(highestScores.com===0&&((extension===".com")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a .com Site:</div><div class='score' id='scoreCom'></div></div>");
    }
    if(highestScores.edu===0&&((extension===".edu")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a .edu Site:</div><div class='score' id='scoreEdu'></div></div>");
    }
    if(highestScores.mil===0&&((extension===".mil")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a .mil Site:</div><div class='score' id='scoreMil'></div></div>");
    }
    if(highestScores.org===0&&((extension===".org")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a .org Site:</div><div class='score' id='scoreOrg'></div></div>");
    }
    if(highestScores.gov===0&&((extension===".gov")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a .gov Site:</div><div class='score' id='scoreGov'></div></div>");
    }
    if(highestScores.net===0&&((extension===".net")&&(scores[0]>0))){
      $(".scores").append("<div><div>Highest Score for a .net Site:</div><div class='score' id='scoreNet'></div></div>");
    }
    if(highestScores.longest===0){
      $(".scores").append("<div><div>Longest Sentence:</div><div class='score' id='scoreLongest'></div></div>");
    }
    if(highestScores.longestBook===0&&((urlType==="book")&&(objFinal.numWords>0))){
      $(".scores").append("<div><div>Longest Sentence from a Book or Book Site:</div><div class='score' id='scoreLongestBook'></div></div>");
    }
    if(highestScores.shortest===0){
      $(".scores").append("<div><div>Shortest Sentence:</div><div class='score' id='scoreShortest'></div></div>");
    }
    if(highestScores.shortestBook===0&&urlType==="book"){
      $(".scores").append("<div><div>Shortest Sentence from a Book or Book Site:</div><div class='score' id='scoreShortestBook'></div></div>");
    }
    if(highestScores.oldest===0){
      $(".scores").append("<div><div>Oldest Sentence Published:</div><div class='score' id='scoreOldest'></div></div>");
    }
    if(highestScores.newest===0){
      $(".scores").append("<div><div>Newest Sentence Published:</div><div class='score' id='scoreNewest'></div></div>");
    }
    if(highestScores.popular===0&&objFinal.numHits>1){
      $(".scores").append("<div><div>Most Popular Sentence:</div><div class='score' id='scorePopular'></div></div>");
    }
    if(highestScores.unique===0){
      $(".scores").append("<div><div>Most Unique Sentence:</div><div class='score' id='scoreUnique'></div></div>");
    }
    if(highestScores.longestURL===0){
      $(".scores").append("<div><div>Longest URL:</div><div class='score' id='scoreLongestURL'></div></div>");
    }
    if(highestScores.shortestURL===0){
      $(".scores").append("<div><div>Shortest URL:</div><div class='score' id='scoreShortestURL'></div></div>");
    }

  // Save data for highest scores
    // Highest score for book
    if((urlType==="book")&&(scores[0]>highestScores.book)){
      highestScores.book = scores[0];
      $("#scoreBook").empty();
      $("#scoreBook").append(highestScores.book);
    }
    // Highest score for news
    if((urlType==="news")&&(scores[0]>highestScores.news)){
      highestScores.news = scores[0];
      $("#scoreNews").empty();
      $("#scoreNews").append(highestScores.news);
    }
    // Highest score for video
    if((urlType==="video")&&(scores[0]>highestScores.video)){
      highestScores.video = scores[0];
      $("#scoreVideo").empty();
      $("#scoreVideo").append(highestScores.video);
    }
    // Highest score for social media and forums
    if((urlType==="social")&&(scores[0]>highestScores.social)){
      highestScores.social = scores[0];
      $("#scoreSocial").empty();
      $("#scoreSocial").append(highestScores.social);
    }
    // Highest score for blogs
    if((urlType==="blog")&&(scores[0]>highestScores.blog)){
      highestScores.blog = scores[0];
      $("#scoreBlog").empty();
      $("#scoreBlog").append(highestScores.blog);
    }
    // Highest score while going blue
    if((scores[11]>0)&&(scores[0]>highestScores.blue)){
      highestScores.blue = scores[0];
      $("#scoreBlue").empty();
      $("#scoreBlue").append(highestScores.blue);
    }
    // Highest score mentioning religion
    if((scores[12]>0)&&(scores[0]>highestScores.religious)){
      highestScores.religious = scores[0];
      $("#scoreReligious").empty();
      $("#scoreReligious").append(highestScores.religious);
    }
    // Highest score for .com site
    if((extension===".com")&&(scores[0]>highestScores.com)){
      highestScores.com = scores[0];
      $("#scoreCom").empty();
      $("#scoreCom").append(highestScores.com);
    }
    // Highest score for .edu site
    if((extension===".edu")&&(scores[0]>highestScores.edu)){
      highestScores.edu = scores[0];
      $("#scoreEdu").empty();
      $("#scoreEdu").append(highestScores.edu);
    }
    // Highest score for .mil site
    if((extension===".mil")&&(scores[0]>highestScores.mil)){
      highestScores.mil = scores[0];
      $("#scoreMil").empty();
      $("#scoreMil").append(highestScores.mil);
    }
    // Highest score for .org site
    if((extension===".org")&&(scores[0]>highestScores.org)){
      highestScores.org = scores[0];
      $("#scoreOrg").empty();
      $("#scoreOrg").append(highestScores.org);
    }
    // Highest score for .gov site
    if((extension===".gov")&&(scores[0]>highestScores.gov)){
      highestScores.gov = scores[0];
      $("#scoreGov").empty();
      $("#scoreGov").append(highestScores.gov);
    }
    // Highest score for .net site
    if((extension===".net")&&(scores[0]>highestScores.net)){
      highestScores.net = scores[0];
      $("#scoreNet").empty();
      $("#scoreNet").append(highestScores.net);
    }
    // Longest sentence
    if(objFinal.numWords>highestScores.longest){
      highestScores.longest = objFinal.numWords;
      $("#scoreLongest").empty();
      $("#scoreLongest").append(highestScores.longest + " words");
    }
    // Longest sentence from a book
    if((urlType==="book")&&(objFinal.numWords>highestScores.longestBook)){
      highestScores.longestBook = objFinal.numWords;
      $("#scoreLongestBook").empty();
      $("#scoreLongestBook").append(highestScores.longestBook + " words");
    }
    // Shortest sentence
    if((objFinal.numWords<highestScores.shortest)||(highestScores.shortest===0)){
      highestScores.shortest = objFinal.numWords;
      $("#scoreShortest").empty();
      $("#scoreShortest").append(highestScores.shortest + " words");
    }
    // Shortest sentence from a book
    if((urlType==="book")&&((objFinal.numWords<highestScores.shortestBook)||(highestScores.shortestBook===0))){
      highestScores.shortestBook = objFinal.numWords;
      $("#scoreShortestBook").empty();
      $("#scoreShortestBook").append(highestScores.shortestBook + " words");
    }
    // oldest year
    if((objFinal.yearRecorded<highestScores.oldest)||(highestScores.oldest===0)){
      highestScores.oldest = objFinal.yearRecorded;
      $("#scoreOldest").empty();
      $("#scoreOldest").append("Year " + highestScores.oldest);
    }
    // newest year
    if((objFinal.yearRecorded>highestScores.newest)||(highestScores.newest===0)){
      highestScores.newest = objFinal.yearRecorded;
      $("#scoreNewest").empty();
      $("#scoreNewest").append("Year " + highestScores.newest);
    }
    // most popular / most number of webhits
    if(objFinal.numHits>highestScores.popular){
      highestScores.popular = objFinal.numHits;
      $("#scorePopular").empty();
      $("#scorePopular").append(objFinal.sentence + " ("+objFinal.numHits.toLocaleString()+" websearch hits in "+objFinal.accessYear+")");
    }
    // most unique / least number of webhits
    if((objFinal.numHits<highestScores.unique)||(highestScores.unique===0)){
      highestScores.unique = objFinal.numHits;
      var hits = "hits";
      if (objFinal.numHits===1){hits="hit";}
      $("#scoreUnique").empty();
      $("#scoreUnique").append(objFinal.sentence + " ("+objFinal.numHits.toLocaleString()+" websearch "+hits+" in "+objFinal.accessYear+")");
    }
    // Longest URL
    if(urlLength>highestScores.longestURL){
      highestScores.longestURL = urlLength;
      $("#scoreLongestURL").empty();
      $("#scoreLongestURL").append(urlLength.toLocaleString()+" characters");
    }
    // Shortest URL
    if((urlLength<highestScores.shortestURL)||(highestScores.shortestURL===0)){
      highestScores.shortestURL = urlLength;
      $("#scoreShortestURL").empty();
      $("#scoreShortestURL").append(urlLength.toLocaleString()+" characters");
    }

  // Display high-score data (if it exists)
  // console.log(highestScores); // DEBUG

  // Thanks for playing
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
  var wordsToCheck = ["bible", "church", "temple", "islam", "christian", "mosque", "jesus", "god", "lord", "christ", "catholic", "evangelical", "jew", "judaism","religion","faith","episcopal","baptist"];
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
  else if(urlType==="blog"){sMedia=95;}
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
        ["youtube","video"],["books.","book"],
        ["facebook","social"],["forum","social"],["reddit","social"],
        ["twitter","social"],["vimeo","video"],
        ["pinterest","social"],["quora","social"],["answers.yahoo","social"],
        ["blog","blog"],["wordpress","blog"],["news","news"],["goodreads","book"],
        ["huffingtonpost","news"],["baltimoresun","news"],["theatlantic","news"],
        ["biblehub","book"],["bloomberg","news"],["amazon.com","book"],
        ["theguardian","news"],["times.com","news"],[".bbs","social"],
        ["sparknotes","book"],["goodreads","book"]
      ];
    for(let i=0; i<urlAssignments.length; i++){
      // console.log(urlAssignments[i]); // DEBUG
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
