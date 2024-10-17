# Codewars: Valid Braces Kata Explanation

## Kata link: https://www.codewars.com/kata/5277c8a221e209d3f6000b56

## Problem Description:

In this kata, you are tasked with determining if a string of braces is valid. The string consists of parentheses `()`, brackets `[]`, and curly braces `{}`. A string is valid if:

- Every opening brace has a corresponding closing brace.
- The braces are properly nested.

### Examples:

- `"(){}[]"` ➡️ **True**
- `"([{}])"` ➡️ **True**
- `"(}"` ➡️ **False**
- `"[(])"` ➡️ **False**
- `"[({})](]"` ➡️ **False**

## Solution:

To solve this problem, we use a **stack**. Here’s the code:

```javascript
function validBraces(braces) {
  const stack = [];
  const matchingBraces = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (let char of braces) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else {
      if (stack.pop() !== matchingBraces[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
```

We use a stack to push opening braces and match them with closing braces. If the stack is empty at the end, the string is valid.
