# Counting Duplicates

**Kata Rank**: 6 kyu
Link: https://**www**.codewars.com/kata/54bf1c2cd5b56cc47f0007a1/javascript

## Description

We need a function that takes a string and returns the count of characters (letters and digits) that appear more than once, regardless of case.

## Solution Code

```javascript
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
```

## Explanation

1- Lowercase Conversion: To make it case-insensitive, we convert the text to lowercase.
2- Frequency Counting: We use an object to store the frequency of each character.
3- Counting Duplicates: We loop through the object to count how many characters appear more than once.

## Example

```js
duplicateCount("abcde"); // Output: 0
duplicateCount("aabbcde"); // Output: 2
duplicateCount("aA11"); // Output: 2
```
