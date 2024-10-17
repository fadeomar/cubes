
function isIsogram(str) {
  // Convert string to lowercase to ignore case sensitivity
  str = str.toLowerCase();
  
  // Create a Set from the string characters
  const uniqueLetters = new Set(str);

  // If the length of the set is the same as the string, it's an isogram
  return uniqueLetters.size === str.length;
}
