
# Codewars: Who Likes It? Explanation

## Problem Description

You probably know the "like" system from Facebook and other platforms. People can "like" blog posts, pictures, or other items. We want to create a function that displays the correct text based on how many people like an item.

### Problem Breakdown:

- If **no one** likes the item, return `"no one likes this"`.
- If **one person** likes the item, return `"Peter likes this"` (assuming the name is Peter).
- If **two people** like the item, return `"Jacob and Alex like this"`.
- If **three people** like the item, return `"Max, John and Mark like this"`.
- If **four or more people** like the item, return `"Alex, Jacob and 2 others like this"` (or however many are left after the first two).

## Solution

Here’s the code to solve this challenge:

```javascript
function likes(names) {
  const count = names.length;
  
  if (count === 0) {
    return "no one likes this";
  } else if (count === 1) {
    return \`\${names[0]} likes this\`;
  } else if (count === 2) {
    return \`\${names[0]} and \${names[1]} like this\`;
  } else if (count === 3) {
    return \`\${names[0]}, \${names[1]} and \${names[2]} like this\`;
  } else {
    return \`\${names[0]}, \${names[1]} and \${count - 2} others like this\`;
  }
}
```

### Explanation

1. We first check how many names are in the array using `names.length`.
2. If the array is **empty**, we return `"no one likes this"`.
3. If there is **one name**, we return `"Peter likes this"`, using the first name from the array.
4. For **two names**, we return `"Jacob and Alex like this"`.
5. For **three names**, we return all three names, with the third preceded by "and".
6. If there are **four or more** names, we display the first two, then indicate how many others liked the item using `"and 2 others like this"` (or however many others remain).

This solution efficiently handles different cases and provides the correct display message based on the input array.
