
function accum(s) {
  return s
    .split('') // Split the string into an array of characters
    .map((char, index) => char.toUpperCase() + char.toLowerCase().repeat(index)) // Capitalize the first letter and repeat the rest based on position
    .join('-'); // Join the resulting array with hyphens
}
