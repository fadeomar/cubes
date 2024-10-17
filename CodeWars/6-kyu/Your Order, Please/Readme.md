# Codewars: Your Order, Please Kata Explanation

## Problem Description:

In this Kata, your task is to sort the words in a given string based on the number each word contains. The numbers range from 1 to 9, and the position of each word in the output string corresponds to the number found within it.

### Example:

- `"is2 Thi1s T4est 3a"` should be sorted to `"Thi1s is2 3a T4est"`.
- `"4of Fo1r pe6ople g3ood th5e the2"` should be sorted to `"Fo1r the2 g3ood 4of th5e pe6ople"`.
- If the input string is empty, the function should return an empty string.

## Solution:

The solution involves splitting the string into words, sorting the words based on the number they contain, and then joining the sorted words back into a string.

### Code:

```javascript
function order(words) {
  return words
    .split(" ") // Step 1: Split string into words
    .sort((a, b) => {
      // Step 2: Sort based on the number in the word
      return a.match(/\d/) - b.match(/\d/); // Use regex to find the number in each word
    })
    .join(" "); // Step 3: Join the sorted words into a string
}
```

### Explanation:

1. `.split(' ')`: This splits the input string into an array of words.
2. `.sort((a, b) => a.match(/\d/) - b.match(/\d/))`: This sorts the array based on the number found in each word. The regex \d matches any digit.
3. `.join(' ')`: After sorting, the words are joined back into a single string.
4. If the input is an empty string, the `split` method returns an empty array, and the function returns an empty string after the `join` method.

### Example Breakdown:

- Input: "is2 Thi1s T4est 3a"

- Output: "Thi1s is2 3a T4est"

- Input: "4of Fo1r pe6ople g3ood th5e the2"

- Output: "Fo1r the2 g3ood 4of th5e pe6ople"

## Time Complexity:

The time complexity is O(n log n) due to the sorting step, where n is the number of words in the input string.
