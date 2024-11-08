# Vowel Count

**Kata Rank**: 7 kyu
**Kata Link**: https://www.codewars.com/kata/54ff3102c1bad923760001f3/train/javascript

## Description

Write a function that returns the count of vowels in a given string. For this kata, consider only `a, e, i, o, u` as vowels.

The input string will contain only lowercase letters and spaces.

## Solution Code

```javascript
function getCount(str) {
  const vowels = "aeiou";
  let count = 0;

  for (let char of str) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return count;
}
```

## Explanation

1. **Vowel Set:** We define a string `vowels` containing the vowels `a, e, i, o, u`.
2. **Counting**: For each character in the input string, we check if it’s a vowel by checking if it’s included in `vowels`.
3. **Return Count**: Finally, we return the count of vowels.

## Examples

```javascript
getCount("hello"); // Output: 2
getCount("codewars"); // Output: 3
getCount("a quick brown fox"); // Output: 5
```
