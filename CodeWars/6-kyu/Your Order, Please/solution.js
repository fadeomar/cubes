function order(words) {
  return words
    .split(" ") // Step 1: Split string into words
    .sort((a, b) => {
      // Step 2: Sort based on the number in the word
      return a.match(/\d/) - b.match(/\d/); // Use regex to find the number in each word
    })
    .join(" "); // Step 3: Join the sorted words into a string
}
