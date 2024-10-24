# Polish Alphabet Transformation

### Kata Description:

There are 32 letters in the Polish alphabet, including vowels and consonants with diacritics. Your task is to replace the Polish letters with their Latin counterparts, like this:

- ą -> a
- ć -> c
- ę -> e
- ł -> l
- ń -> n
- ó -> o
- ś -> s
- ź -> z
- ż -> z

Example:

```
Input: "Jędrzej Błądziński" Output: "Jedrzej Bladzinski"
```

### Solution:

```javascript
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

  return str.replace(/[ąćęłńóśźż]/g, (char) => polishToLatin[char]);
}
```

### Explanation:

We create an object that holds the Polish letters as keys and their Latin equivalents as values. Then, we use the `replace()` method with a regular expression that matches any Polish letter, and swap it with the mapped value.

### JavaScript File (`Polish_Alphabet_Transformation.js`):

```javascript
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

  return str.replace(/[ąćęłńóśźż]/g, (char) => polishToLatin[char]);
}
```
