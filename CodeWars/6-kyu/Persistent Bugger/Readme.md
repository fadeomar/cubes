# Codewars: Persistent Bugger Kata Explanation

## Problem Description:

In this Kata, you are tasked with finding the multiplicative persistence of a number. Multiplicative persistence is the number of times you must multiply the digits of a number until you get a single-digit result.

### Example:

- `39` becomes:

  - 3 \* 9 = 27
  - 2 \* 7 = 14
  - 1 \* 4 = 4 (final result, 3 steps)

- `999` becomes:

  - 9 _ 9 _ 9 = 729
  - 7 _ 2 _ 9 = 126
  - 1 _ 2 _ 6 = 12
  - 1 \* 2 = 2 (final result, 4 steps)

- `4` is already a single-digit, so the persistence is `0`.

## Solution:

The solution involves looping over the digits of the number and multiplying them together until the result is a single digit. We keep track of how many steps it took to reach that single digit.

### Code:

```javascript
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
```

## Explanation:

1. `.toString().split('')`: Converts the number into a string and splits it into an array of individual characters (digits).
2. `.map(Number)`: Converts each string digit back into a number.
3. `.reduce((a, b) => a * b)`: Multiplies all the digits together using the reduce method.
4. `while (num >= 10)`: Continues as long as the number has more than one digit.
5. `count++`: Counts the number of multiplication steps.
6. Finally, the function returns the number of steps it took to reach a single digit.

## Example Breakdown:

- Input: `39`
- Output: `3` (after 3 multiplications to reach a single-digit result).

## Time Complexity:

The time complexity is dependent on the number of digits in the number. For a number with n digits, the process involves multiplying and reducing it until a single-digit is left, which generally runs in logarithmic steps with respect to the size of the input.
