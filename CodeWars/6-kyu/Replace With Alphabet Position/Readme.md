# Codewars: Replace With Alphabet Position Kata Explanation

Kata link: [Replace With Alphabet Position](https://www.codewars.com/kata/546f922b54af40e1e90001da)

## Problem Description:

In this kata, you need to replace every letter in a string with its corresponding position in the alphabet. Any non-letter characters should be ignored.

For example:

- "a" becomes 1.
- "b" becomes 2.
- If the string contains non-letter characters like spaces or punctuation, they are ignored in the output.

### Example:

- Input: `"The sunset sets at twelve o' clock."`
- Output: `"20 8 5 19 21 14 19 5 20 19 5 20 19 1 20 20 23 5 12 22 5 15 3 12 15 3 11"`

## Solution:

The solution involves iterating over the string, filtering out non-letters, and mapping each letter to its position in the alphabet using ASCII codes. Here's the code:

```javascript
function alphabetPosition(text) {
  return text
    .toLowerCase() // Convert text to lowercase
    .split("") // Split the string into individual characters
    .filter((char) => /[a-z]/.test(char)) // Keep only letters
    .map((char) => char.charCodeAt(0) - 96) // Convert each letter to its alphabet position
    .join(" "); // Join the numbers with spaces
}
```

## How it Works:

- The .toLowerCase() function converts the entire string to lowercase so we can treat uppercase and lowercase letters the same.
- The .split('') method splits the string into individual characters.
- The .filter(char => /[a-z]/.test(char)) keeps only characters that are letters, filtering out non-letters.
- The .map(char => char.charCodeAt(0) - 96) converts each letter to its alphabet position.
- The .join(' ') joins the array of numbers into a single string with spaces between the numbers.

## Example Breakdown:

- Input: "The sunset sets at twelve o' clock."
- Conversion: "20 8 5 19 21 14 19 5 20 19 5 20 19 1 20 20 23 5 12 22 5 15 3 12 15 3 11"
