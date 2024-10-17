function alphabetPosition(text) {
  return text
    .toLowerCase() // Convert text to lowercase
    .split("") // Split the string into individual characters
    .filter((char) => /[a-z]/.test(char)) // Keep only letters
    .map((char) => char.charCodeAt(0) - 96) // Convert each letter to its alphabet position
    .join(" "); // Join the numbers with spaces
}
