/**
 * Kata: Counting Duplicates
 * Kata Link: https://www.codewars.com/kata/54bf1c2cd5b56cc47f0007a1/javascript
 
Count the number of Duplicates
Write a function that will return the count of distinct case-insensitive
alphabetic characters and numeric digits that occur more than once in the input string. The
input string can be assumed to contain only alphabets 
(both uppercase and lowercase) and numeric digits.
 */

function duplicateCount(text) {
  const lowerText = text.toLowerCase();
  const charCount = {};

  for (let char of lowerText) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  let duplicates = 0;
  for (let count in charCount) {
    if (charCount[count] > 1) {
      duplicates++;
    }
  }

  return duplicates;
}
