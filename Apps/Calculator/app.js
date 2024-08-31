// input/output button
const input = document.getElementById("input");

// number buttons
const numbers = document.querySelectorAll(".numbers div");

// operator buttons
const operator = document.querySelectorAll(".operators div");

// equal button
const result = document.getElementById("result");

// clear button
const clear = document.getElementById("clear");

// flag to keep an eye on what output is displayed
let resultDisplayed = false;
let currentString = "";

// adding click handlers to number buttons
for (let i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("click", (e) => {
    // storing current input string and its last character in variables - used later
    currentString = input.textContent;
    const lastChar = currentString[currentString.length - 1];

    // if result is not diplayed, just keep adding
    if (resultDisplayed === false) {
      input.textContent += e.target.textContent;
    } else if (
      (resultDisplayed === true && lastChar === "+") ||
      lastChar === "-" ||
      lastChar === "×" ||
      lastChar === "÷"
    ) {
      // if result is currently displayed and user pressed an operator
      // we need to keep on adding to the string for next operation
      resultDisplayed = false;
      input.textContent += e.target.textContent;
    } else {
      // if result is currently displayed and user pressed a number
      // we need clear the input string and add the new input to start the new opration
      resultDisplayed = false;
      input.textContent = "";
      input.textContent += e.target.textContent;
    }
  });
}

// adding click handlers to number buttons
for (let i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click", (e) => {
    // storing current input string and its last character in variables - used later
    currentString = input.textContent;
    const lastChar = currentString[currentString.length - 1];

    // if last character entered is an operator, replace it with the currently pressed one
    if (
      lastChar === "+" ||
      lastChar === "-" ||
      lastChar === "×" ||
      lastChar === "÷"
    ) {
      const newString =
        currentString.substring(0, currentString.length - 1) +
        e.target.textContent;
      input.textContent = newString;
    } else if (currentString.length == 0) {
      // if first key pressed is an opearator, don't do anything
      console.log("enter a number first");
    } else {
      // else just add the operator pressed to the input
      input.textContent += e.target.textContent;
    }
  });
}

// on click of 'equal' button

result.addEventListener("click", () => {
  // this is the string that we will be processing eg. -10+26+33-56*34/23
  const inputString = input.textContent;

  // forming an array of numbers. eg for above string it will be: numbers = ["10", "26", "33", "56", "34", "23"]
  const formattedNumbers = inputString.split(/\+|\-|\×|\÷/g);

  // forming an array of operators. for above string it will be: operators = ["+", "+", "-", "*", "/"]
  // first we replace all the numbers and dot with empty string and then split
  const formattedOperators = inputString.replace(/[0-9]|\./g, "").split("");

  // now we are looping through the array and doing one operation at a time.
  // first divide, then multiply, then subtraction and then addition
  // as we move we are alterning the original numbers and operators array
  // the final element remaining in the array will be the output
  /** DIVIDE */
  let divide = formattedOperators.indexOf("÷");
  while (divide != -1) {
    formattedNumbers.splice(
      divide,
      2,
      formattedNumbers[divide] / formattedNumbers[divide + 1]
    );
    formattedOperators.splice(divide, 1);
    divide = formattedOperators.indexOf("÷");
  }
  /** MULTIPLY */
  let multiply = formattedOperators.indexOf("×");
  while (multiply != -1) {
    formattedNumbers.splice(
      multiply,
      2,
      formattedNumbers[multiply] * formattedNumbers[multiply + 1]
    );
    formattedOperators.splice(multiply, 1);
    multiply = formattedOperators.indexOf("×");
  }

  /** SUBTRACT */
  let subtract = formattedOperators.indexOf("-");
  while (subtract != -1) {
    formattedNumbers.splice(
      subtract,
      2,
      formattedNumbers[subtract] - formattedNumbers[subtract + 1]
    );
    formattedOperators.splice(subtract, 1);
    subtract = formattedOperators.indexOf("-");
  }

  /** ADD */
  let add = formattedOperators.indexOf("+");
  while (add != -1) {
    // using parseFloat is necessary, otherwise it will result in string concatenation :)
    formattedNumbers.splice(
      add,
      2,
      parseFloat(formattedNumbers[add]) + parseFloat(formattedNumbers[add + 1])
    );
    formattedOperators.splice(add, 1);
    add = formattedOperators.indexOf("+");
  }

  // displaying the output
  input.textContent = formattedNumbers[0];

  // turning flag if result is displayed
  resultDisplayed = true;
});

// clearing the input on press of clear
clear.addEventListener("click", () => (input.textContent = ""));
