// Initial setup of the canvas and context
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// Set canvas to a square of 400x400
canvas.width = 400;
canvas.height = 400;

// Main function to animate the shape
function animateShape() {
  // Get current time in milliseconds and calculate scale factors
  const currentTime = new Date().getTime() / 10;
  const heightFactor = 0.9 + Math.sin(currentTime / 100) * 0.3;

  // Clear canvas with a black background
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set stroke style for the shape
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = "hsla(244, 60%, 60%, 0.3)";
  ctx.fillStyle = "hsla(244, 60%, 60%, 0.3)";

  // Generate and render points for the shape
  let pointsArray = generatePoints(currentTime, heightFactor);
  renderShape(pointsArray, heightFactor);

  // Continuously animate using requestAnimationFrame
  requestAnimationFrame(animateShape);
}

// Function to generate points for the shape
function generatePoints(currentTime, heightFactor) {
  let pointsArray = [];

  // Loop for the top part of the shape
  for (let i = 0; i < 180; i++) {
    let ratio = (i + 1) / 180;
    let horizontalScale = Math.cos((ratio * Math.PI) / 2);
    let verticalScale = Math.sin((ratio * Math.PI) / 2);
    ratio = 1 - ratio;

    // Calculate points for this part
    let shapePoints = calculatePoints(
      100 * horizontalScale,
      ratio,
      horizontalScale,
      verticalScale,
      heightFactor,
      currentTime
    );
    pointsArray.push(shapePoints);
  }

  // Loop for the bottom part of the shape
  for (let i = 0; i < 100; i++) {
    let ratio = (i + 1) / 100;
    let shapePoints = calculatePoints(
      100 * ratio,
      ratio,
      ratio,
      0,
      heightFactor,
      currentTime
    );
    pointsArray.push(shapePoints);
  }

  return pointsArray;
}

// Function to calculate points for a given segment of the shape

function calculatePoints(
  pointCount,
  ratio,
  horizontalScale,
  verticalScale,
  heightFactor,
  currentTime
) {
  let points = [];

  // Angle step based on number of points
  let angleStep = (Math.PI * 2) / pointCount;

  for (let i = 0; i < pointCount; i++) {
    let angle = i * angleStep;
    let x = Math.cos(angle) * horizontalScale;
    let y = Math.sin(angle) * horizontalScale;
    let z = calculateZOffset(angle, ratio, currentTime);
    x -= z * ratio;

    // Store x, y, z for this point
    points.push([x, y, heightFactor + z * ratio + verticalScale]);
  }
  return points;
}

function calculateZOffset(angle, ratio, currentTime) {
  let offset =
    Math.sin(angle * 2 - currentTime / 13 + ratio * 13) / 20 +
    Math.sin(angle * 5 - currentTime / 17 + ratio * 13) / 20 +
    Math.sin(angle * 7 - currentTime / 19 + ratio * 13) / 40;

  return offset;
}

// Function to render the shape based on generated points
function renderShape(pointsArray, heightFactor) {
  pointsArray.forEach((points) => {
    let transformedPoints = points.map(([x, y, z]) => {
      let scaleFactor = Math.pow(1.5, y / 2);

      return [
        // Transform X based on scaling and canvas position
        x * scaleFactor * 150 + 200,
        // Transform Y based on scaling and canvas position
        z * scaleFactor * 200 - heightFactor * 200 + 150,
      ];
    });

    // Draw the shape by connecting the points
    ctx.beginPath();
    transformedPoints.forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  });
}
// Start the animation
animateShape();
