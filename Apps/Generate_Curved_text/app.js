// JavaScript variables to store elements
const textInput = document.getElementById("text-input");
const radiusRange = document.getElementById("radius-range");
const arcRange = document.getElementById("arc-range");
const startOffset = document.getElementById("start-offset");
const fontSize = document.getElementById("font-size");
const fontColor = document.getElementById("font-color");
const letterSpacing = document.getElementById("letter-spacing");
const previewText = document.getElementById("preview-text");
const textPath = document.getElementById("text-path");
const resetButton = document.getElementById("reset-button");
const generateButton = document.getElementById("generate-button");
const htmlCodeOutput = document.getElementById("html-code");
const cssCodeOutput = document.getElementById("css-code");
const jsCodeOutput = document.getElementById("js-code");
const showPathLineCheckbox = document.getElementById("show-path-line");
const circularArcCheckbox = document.getElementById("circular-arc");

// Function to update preview text content
function updateTextContent() {
  const textValue = textInput.value || "Your Text Here";
  const textPathElement = previewText.querySelector("textPath");
  if (textPathElement) {
    textPathElement.textContent = textValue;
  }
}

function updatePath1() {
  console.log({ circularArcCheckbox: circularArcCheckbox.checked });
  const radius = parseInt(radiusRange.value);
  const arcSpan = parseInt(arcRange.value);
  const largeArcFlag = arcSpan > 180 ? 1 : 0;

  // Center position for the arc
  const centerX = 250; // Center of the SVG width
  const centerY = 250; // Center of the SVG height

  if (circularArcCheckbox.checked) {
    // Calculate start and end positions based on radius and arc span
    const startAngle = (-arcSpan / 2) * (Math.PI / 180);
    const endAngle = (arcSpan / 2) * (Math.PI / 180);
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    // Updating the path `d` attribute to create a centered arc
    textPath.setAttribute(
      "d",
      `M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`
    );

    // Update the start offset to center the text based on the arc span and start offset input
    const offset = startOffset.value;
    const textPathElement = previewText.querySelector("textPath");
    if (textPathElement) {
      textPathElement.setAttribute("startOffset", `${offset}%`);
    }
  } else {
    // Calculate start and end positions based on the radius and arc span
    const startX = centerX - radius * Math.cos((arcSpan * Math.PI) / 360);
    const startY = centerY - radius * Math.sin((arcSpan * Math.PI) / 360);
    const endX = centerX + radius * Math.cos((arcSpan * Math.PI) / 360);
    const endY = centerY + radius * Math.sin((arcSpan * Math.PI) / 360);

    // Updating the path `d` attribute for a centered arc
    textPath.setAttribute(
      "d",
      `M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`
    );

    // Update the start offset to center the text based on the arc span and start offset input
    const offset = startOffset.value;
    const textPathElement = previewText.querySelector("textPath");
    if (textPathElement) {
      textPathElement.setAttribute("startOffset", `${offset}%`);
    }
  }
}

// Function to update path visibility
function togglePathVisibility() {
  textPath.style.stroke = showPathLineCheckbox.checked ? "#000" : "none";
}

// Event listeners for input changes
radiusRange.addEventListener("input", updatePath1);
arcRange.addEventListener("input", updatePath1);
startOffset.addEventListener("input", updatePath1);
showPathLineCheckbox.addEventListener("change", togglePathVisibility);
// Event listener to update path on checkbox change
circularArcCheckbox.addEventListener("change", updatePath1);
// Function to update font properties
function updateFontProperties() {
  previewText.setAttribute("font-size", fontSize.value);
  previewText.setAttribute("fill", fontColor.value);
  previewText.style.letterSpacing = `${letterSpacing.value}px`;
}

// Function to reset all controls to their default values
function resetControls() {
  textInput.value = "Your Text Here";
  radiusRange.value = 150;
  arcRange.value = 180;
  startOffset.value = 50;
  fontSize.value = 24;
  fontColor.value = "#000000";
  letterSpacing.value = 1;
  showPathLineCheckbox.checked = true;

  updateTextContent();
  updatePath1();
  updateFontProperties();
  togglePathVisibility(); // Apply path visibility reset
}

// Function to generate code snippets for HTML, CSS, and JavaScript
function generateCode() {
  const htmlCode = `
<svg width="500" height="500">
  <path d="M 250,150 A ${radiusRange.value},${radiusRange.value} 0 ${
    arcRange.value > 180 ? 1 : 0
  },1 ${250 + radiusRange.value * Math.cos((arcRange.value * Math.PI) / 180)},${
    150 - radiusRange.value * Math.sin((arcRange.value * Math.PI) / 180)
  }" id="text-path" fill="transparent" stroke="${
    showPathLineCheckbox.checked ? "#000" : "none"
  }"></path>
  <text font-size="${fontSize.value}" fill="${
    fontColor.value
  }" style="letter-spacing: ${letterSpacing.value}px;">
    <textPath href="#text-path" startOffset="${startOffset.value}%">${
    textInput.value
  }</textPath>
  </text>
</svg>`.trim();

  const cssCode = `
svg {
  width: 500px;
  height: 500px;
}

path {
  fill: transparent;
  stroke: ${showPathLineCheckbox.checked ? "#000" : "none"};
}

text {
  font-size: ${fontSize.value}px;
  fill: ${fontColor.value};
  letter-spacing: ${letterSpacing.value}px;
}
`.trim();

  const jsCode = `
document.querySelector('textPath').setAttribute('startOffset', '${startOffset.value}%');
`.trim();

  htmlCodeOutput.textContent = htmlCode;
  cssCodeOutput.textContent = cssCode;
  jsCodeOutput.textContent = jsCode;
}

// Event listeners for updating, resetting, and generating code
textInput.addEventListener("input", updateTextContent);
fontSize.addEventListener("input", updateFontProperties);
fontColor.addEventListener("input", updateFontProperties);
letterSpacing.addEventListener("input", updateFontProperties);
resetButton.addEventListener("click", resetControls);
generateButton.addEventListener("click", generateCode);

// Initial setup
resetControls();
