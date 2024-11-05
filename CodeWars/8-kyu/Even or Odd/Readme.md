# Even or Odd

**Kata Link**: https://www.codewars.com/kata/53da3dbb4a5168369a0000fe

**Kata Rank**: 8 kyu

## Description

Create a function that takes an integer as an argument and returns:

- "Even" if the number is even
- "Odd" if the number is odd

## Solution Code

```javascript
function evenOrOdd(number) {
  return number % 2 === 0 ? "Even" : "Odd";
}
```

## Explanation

- Modulo Operator: `number % 2` checks if there’s a remainder when the integer is divided by 2.
- Ternary Operator: If `number % 2 === 0` is true, it returns "Even"; otherwise, it returns "Odd".

## Example

```js
evenOrOdd(3); // Output: "Odd"
evenOrOdd(4); // Output: "Even"
evenOrOdd(0); // Output: "Even"
```
