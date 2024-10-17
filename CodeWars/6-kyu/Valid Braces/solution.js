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
