// Get the canvas element from the DOM
const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");

// Set up canvas dimensions based on device pixel ratio
function setCanvasSize() {
  canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
  canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
}
setCanvasSize();

// VARIABLES
let canvasWidth = canvas.clientWidth;
let canvasHeight = canvas.clientHeight;
let rotationAngle = 0; // Rotation of the globe
let dotsArray = []; // Array to hold dots

const TOTAL_DOTS = 1000; // Number of dots
const DOT_SIZE = 4; // Size of each dot
let globeRadius = canvasWidth * 0.7; // Radius of the globe
let globeCenterZ = -globeRadius; // Z-axis position of the globe's center
let canvasCenterX = canvasWidth / 2; // X center of the canvas
let canvasCenterY = canvasHeight / 2; // Y center of the canvas
let perspectiveDepth = canvasWidth * 0.8; // Perspective field of view

// DOT FUNCTIONS
function createDot(x, y, z) {
  // Define the dot's 3D coordinates and projected values
  const dot = {
    x,
    y,
    z,
    xProjected: 0,
    yProjected: 0,
    sizeProjected: 0,
  };

  // Function to project 3D coordinates into 2D space
  function project(sinAngle, cosAngle) {
    const rotatedX = cosAngle * dot.x + sinAngle * (dot.z - globeCenterZ);

    const rotatedZ =
      -sinAngle * dot.x + cosAngle * (dot.z - globeCenterZ) + globeCenterZ;
    const scaleFactor = perspectiveDepth / (perspectiveDepth - rotatedZ);

    dot.xProjected = rotatedX * scaleFactor + canvasCenterX;
    dot.yProjected = dot.y * scaleFactor + canvasCenterY;
    dot.sizeProjected = DOT_SIZE * scaleFactor;
  }

  // Function to draw the dot on the canvas
  function draw(sinAngle, cosAngle) {
    project(sinAngle, cosAngle);
    ctx.beginPath();
    ctx.arc(dot.xProjected, dot.yProjected, dot.sizeProjected, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  // Return the dot object with its methods
  return {
    project,
    draw,
  };
}

// Create dots and position them on the globe

function initializeDots() {
  dotsArray = [];

  for (let i = 0; i < TOTAL_DOTS; i++) {
    const theta = Math.random() * 2 * Math.PI; // Angle around the globe
    const phi = Math.acos(Math.random() * 2 - 1); // Latitude on the globe

    const x = globeRadius * Math.sin(phi) * Math.cos(theta);
    const y = globeRadius * Math.sin(phi) * Math.sin(theta);
    const z = globeRadius * Math.cos(phi) + globeCenterZ;

    dotsArray.push(createDot(x, y, z));
  }
}

// RENDER
function renderScene(timestamp) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  //  Update rotation angle
  rotationAngle = timestamp * 0.0004;
  const sinAngle = Math.sin(rotationAngle);
  const cosAngle = Math.cos(rotationAngle);

  // Draw each dot
  dotsArray.forEach((dot) => dot.draw(sinAngle, cosAngle));

  window.requestAnimationFrame(renderScene);
}

// RESIZE EVENT
function onResize() {
  setCanvasSize();
  canvasWidth = canvas.clientWidth;
  canvasHeight = canvas.clientHeight;
  globeRadius = canvasWidth * 0.7;
  globeCenterZ = -globeRadius;
  canvasCenterX = canvasWidth / 2;
  canvasCenterY = canvasHeight / 2;
  perspectiveDepth = canvasWidth * 0.8;

  initializeDots(); // Recreate dots after resizing
}

window.addEventListener("resize", onResize);

// Initialize the scene
initializeDots();
window.requestAnimationFrame(renderScene);
