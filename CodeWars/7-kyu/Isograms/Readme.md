
# Codewars: Isogram Kata Explanation

## Problem Description

An **isogram** is a word that has no repeating letters, consecutive or non-consecutive. Your task is to implement a function that determines whether a string is an isogram. We assume:
- The input string contains only letters.
- The empty string is an isogram.
- Letter case is ignored (for example, "moOse" should return false because 'o' repeats).

### Examples:

- `"Dermatoglyphics"` ➡️ `true`
- `"aba"` ➡️ `false`
- `"moOse"` ➡️ `false`

## Solution

Here's the code to solve the problem:

```javascript
function isIsogram(str) {
  // Convert string to lowercase to ignore case sensitivity
  str = str.toLowerCase();
  
  // Create a Set from the string characters
  const uniqueLetters = new Set(str);

  // If the length of the set is the same as the string, it's an isogram
  return uniqueLetters.size === str.length;
}
```

### Explanation:

1. **Lowercase the String**: We first convert the string to lowercase using `str.toLowerCase()` to ensure case insensitivity.
2. **Use a Set for Uniqueness**: In JavaScript, the `Set` object only stores unique values. We create a new set from the string's characters, which automatically removes any duplicates.
3. **Check Lengths**: We then check if the length of the original string matches the length of the set. If they are the same, the word is an isogram, and we return `true`. Otherwise, we return `false`.

This approach is efficient and clear!
