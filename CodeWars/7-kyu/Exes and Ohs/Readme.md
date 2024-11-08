# Exes and Ohs

**Kata Rank**: 7 kyu
**Kata Link**: https://www.codewars.com/kata/55908aad6620c066bc00002a/train/javascript

## Description

Create a function that checks if a string has the same number of `x` and `o` characters, case-insensitively. If the counts are equal, return `true`; otherwise, return `false`. If neither `x` nor `o` are present, return `true`.

## Solution Code

```javascript
function XO(str) {
  const lowerStr = str.toLowerCase();
  const xCount = (lowerStr.match(/x/g) || []).length;
  const oCount = (lowerStr.match(/o/g) || []).length;
  return xCount === oCount;
}
```

## Explanation

1. Convert to Lowercase: Convert the input string to lowercase to ensure case-insensitivity.
2. Count x and o: Use regular expressions to find all occurrences of x and o. Use an empty array [] if there are no matches.
3. Return Comparison: Return true if the counts are equal, or if there are no x and o characters; otherwise, return false.

## Examples

```javascript
XO("ooxx"); // Output: true
XO("xooxx"); // Output: false
XO("ooxXm"); // Output: true
XO("zpzpzpp"); // Output: true
XO("zzoo"); // Output: false
```
