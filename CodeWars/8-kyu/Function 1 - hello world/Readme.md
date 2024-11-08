# Function 1 - hello world

**Kata Rank**: 8 kyu
Link: https://www.codewars.com/kata/523b4ff7adca849afe000035

## Description

Make a simple function called greet that returns the most-famous "hello world!".

Style Points
Sure, this is about as easy as it gets. But how clever can you be to create the most creative "hello world" you can think of? What is a "hello world" solution you would want to show your friends?

## Solution Code

```javascript
function greet() {
  return ["hello", "world!"].join(" ");
}
```

## Explanation

1- Template Literals: Using backticks allows us to structure strings in a fun way.
2- Array Join: An array with "hello" and "world!" is joined back together to make the output phrase.

## Example

```js
greet(); // Output: "hello world!"
```
