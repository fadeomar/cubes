function correctPolishLetters(str) {
  const polishToLatin = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  };

  // Use replace method with regex to replace letters in the string
  return str.replace(/[ąćęłńóśźż]/g, (char) => polishToLatin[char]);
}
