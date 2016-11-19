// Pius Wong
// This JS file is for parsing the raw JSON sentence data into a
// tree structure JSON that can be accessed by the main JS files more easily.

// Read in raw JSON
// Count number of sentences = NS
// Create new JSON with data parsed into tree structure, with nested objects
// LOOP1 (stop if s>S)
  // Read in sentence (index s)
  // Split sentence into array of words according to spaces
  // cound number of words N
  // Remove certain punctuation from elements: .,!?  (but not -'/_)
  // Replace _ with a space
  // Set 1st layer of the new JSON as the working layer (reset search)
    // workingLayer = {new JSON}
  // LOOP2 (exit loop if index > N)
    // Take single word from sentence array at index (or next index)
    // Count how many words are already in this working layer of JSON (nChoices)
    // Check if word is already found in the working layer of the new JSON
    // If word is not found,
      // add the word to the working layer of the new JSON, as an object:
        // Name the object according to nChoices in this layer already
          // 0 => A, 1 => B, 2 => C, etc [open ended?]
        // Define the word object accordingly:
          // A{ word: "....",
          // order: "n",
          // next: {[empty obj to fill later]} }
        // If this is not the last word of the sentence (n !== N):
          // set empty "next" object as the new working layer in the new JSON
        // If this is the last word (n === N):
          // add the terminal tree branch obj properties:
            // numWords: N,
            // numHits: integer,
            // link: "www....",
            // recordYear: 1999,
            // accessYear: 2016,
            // accessMonth: "October"
            // sentence: "full original sentence w/ punctuation"
    // If word is found in new JSON already in the working layer:
      // go to found word object and set its "next" object as the working layer
    // Go to next word in the sentence (n+1); go back to LOOP2
  // Go to next sentence (s+1); go back to LOOP1
// output size of JSON in bytes to check


// Display anything to check
var HTMLgeneric = '<br\><b>%data%</b>';
var outputData = HTMLgeneric.replace("%data%",rawData[0].sentence);
$(".output").append([outputData]);
