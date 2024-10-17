# Codewars: Shortest Word Kata Explanation

## Problem Description

In this kata, you are given a string of words, and your task is to return the length of the shortest word in the string.

The string will never be empty, and there’s no need to handle different data types.

### Example:

- `"The quick brown fox"` ➡️ 3
- `"JavaScript is awesome"` ➡️ 2

## Solution

Here’s the code to solve the problem:

```javascript
function findShort(s) {
  return Math.min(...s.split(" ").map((word) => word.length));
}
```

Kata link: https://www.codewars.com/kata/57cebe1dc6fdc20c57000ac9
