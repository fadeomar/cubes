
# Codewars: Accum Kata Explanation

## Problem Description

In this kata, you need to transform an input string so that each letter is repeated a number of times based on its position in the string. The first letter should be capitalized, and the rest should be lowercase. Each transformed letter is separated by hyphens.

### Examples:

- `"abcd"` ➡️ `"A-Bb-Ccc-Dddd"`
- `"RqaEzty"` ➡️ `"R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy"`
- `"cwAt"` ➡️ `"C-Ww-Aaa-Tttt"`

The input string contains only letters from `a..z` and `A..Z`.

## Solution

Here's the code to solve the problem:

```javascript
function accum(s) {
  return s
    .split('') // Split the string into an array of characters
    .map((char, index) => char.toUpperCase() + char.toLowerCase().repeat(index)) // Capitalize the first letter and repeat the rest based on position
    .join('-'); // Join the resulting array with hyphens
}
```

### Explanation:

1. **Split the string**: We first split the input string into individual characters using `.split('')`.
2. **Transform each character**: Using `.map()`, we loop through each character, capitalizing the first letter and repeating it based on its index in the string. We also add lowercase repeats.
3. **Join the characters**: After transformation, we join the characters back together using `.join('-')` to insert hyphens between them.

This solution is efficient and straightforward!
