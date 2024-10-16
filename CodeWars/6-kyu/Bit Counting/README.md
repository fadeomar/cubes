
# Challenge: Bit Counting

### Kata Level: 6 kyu

## Problem:
Write a function that takes an integer as input, and returns the number of bits that are equal to one in the binary representation of that number. You can guarantee that input is non-negative.

### Example:
The binary representation of 1234 is 10011010010, so the function should return 5 in this case.

## Solution:
```javascript
var countBits = function(n) {
  return n.toString(2).split('1').length - 1;
};
```

## Explanation:
This function converts the given integer `n` to its binary representation using the `toString(2)` method, which converts a number to a base 2 string. Then, the binary string is split by the digit '1'. The resulting array's length minus 1 gives the count of how many '1's were in the binary string.
