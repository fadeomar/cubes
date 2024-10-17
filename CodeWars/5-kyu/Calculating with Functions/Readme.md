# Codewars: Calculating with Functions Kata Explanation

## Kata link: https://www.codewars.com/kata/525f3eda17c7cd9f9e000b39

## Problem Description

In this kata, we create a set of number functions (zero to nine) and operation functions (plus, minus, times, dividedBy). These functions must be able to handle a single calculation where the outer function is the left operand and the inner function is the right operand.

### Example Calculations:

- `seven(times(five()))` ➡️ 35
- `four(plus(nine()))` ➡️ 13
- `eight(minus(three()))` ➡️ 5
- `six(dividedBy(two()))` ➡️ 3

### Solution

Here’s the code to solve the problem:

```javascript
function zero(op) {
  return op ? op(0) : 0;
}
function one(op) {
  return op ? op(1) : 1;
}
function two(op) {
  return op ? op(2) : 2;
}
function three(op) {
  return op ? op(3) : 3;
}
function four(op) {
  return op ? op(4) : 4;
}
function five(op) {
  return op ? op(5) : 5;
}
function six(op) {
  return op ? op(6) : 6;
}
function seven(op) {
  return op ? op(7) : 7;
}
function eight(op) {
  return op ? op(8) : 8;
}
function nine(op) {
  return op ? op(9) : 9;
}

function plus(b) {
  return function (a) {
    return a + b;
  };
}
function minus(b) {
  return function (a) {
    return a - b;
  };
}
function times(b) {
  return function (a) {
    return a * b;
  };
}
function dividedBy(b) {
  return function (a) {
    return Math.floor(a / b);
  };
}
```

Step-by-step solution:
Number functions (zero to nine): Each number function can either return itself when no operation is passed or perform the operation if given one.

```javascript
function seven(op) {
  return op ? op(7) : 7;
}
```

This checks if an operation (op) is passed in. If it is, the number becomes the left operand.

Operation functions (plus, minus, times, dividedBy): Each operation returns a function that takes the left operand (a) and applies the operation with the right operand (b).

```javascript
function times(b) {
  return function (a) {
    return a * b;
  };
}
```

This allows us to chain operations and numbers, like seven(times(five())).

Integer Division: The dividedBy function uses Math.floor() to ensure integer division:

```javascript
function dividedBy(b) {
  return function (a) {
    return Math.floor(a / b);
  };
}
```

That’s it! This pattern makes the code super reusable for different combinations of numbers and operations. Try it out!
