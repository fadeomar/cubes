# Keep Hydrated!

**Kata Rank**: 8 kyu
Link: https://www.codewars.com/kata/582cb0224e56e068d800003c

## Description

Nathan drinks 0.5 liters of water per hour while cycling. Given the time in hours, return the total liters of water Nathan will drink, rounded down to the nearest whole number.

## Solution Code

```javascript
function litres(time) {
  return Math.floor(time * 0.5);
}
```

## Explanation

Multiplication: time \* 0.5 calculates the liters Nathan drinks based on cycling time.
Math.floor(): Rounds down the result to the nearest integer.

## Example

```js
litres(3); // Output: 1
litres(6.7); // Output: 3
litres(11.8); // Output: 5
```
