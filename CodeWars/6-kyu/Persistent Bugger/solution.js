function persistence(num) {
  let count = 0;

  while (num >= 10) {
    // Continue until the number is a single digit
    num = num
      .toString()
      .split("") // Convert number to string, split into digits
      .map(Number) // Convert each string digit back to a number
      .reduce((a, b) => a * b); // Multiply all digits together
    count++; // Increase count each time we multiply
  }

  return count; // Return how many times we multiplied the digits
}
