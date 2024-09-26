const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

const mousePosition = { x: 0, y: 0 };

const gravity = 0.99;

// Update canvas size when window is resized
const resizeCanvas = () => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
};

window.addEventListener("resize", resizeCanvas);

// Track mouse position
window.addEventListener("mousemove", (event) => {
  mousePosition.x = event.clientX;
  mousePosition.y = event.clientY;
});

// Generate a random RGBA color
const getRandomColor = () => {
  const red = Math.round(Math.random() * 255);
  const green = Math.round(Math.random() * 255);
  const blue = Math.round(Math.random() * 255);
  // Ensure alpha is between 0.1 and 1
  const alpha = (Math.random() * 0.9 + 0.1).toFixed(1);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

// Create a ball object
function createBall() {
  const ball = {
    color: getRandomColor(),
    radius: Math.random() * 20 + 14,
    initialRadius: null, // Set this after radius assignment
    xPos:
      Math.random() * (canvasWidth - (Math.random() * 20 + 14) * 2) +
      (Math.random() * 20 + 14),
    yPos: Math.random() * (canvasHeight - (Math.random() * 20 + 14)),
    verticalVelocity: Math.random() * 2,
    horizontalVelocity: (Math.random() - 0.5) * 10,
    velocityIncrement: Math.random() / 5,
  };

  ball.initialRadius = ball.radius; // Initialize the start radius

  // Update the ball's position and handle interactions
  ball.update = function () {
    // Draw the ball
    context.beginPath();
    context.arc(ball.xPos, ball.yPos, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();

    //  Update position
    ball.yPos += ball.verticalVelocity;
    ball.xPos += ball.horizontalVelocity;

    // Bounce off the bottom of the canvas
    if (ball.yPos + ball.radius >= canvasHeight) {
      ball.verticalVelocity = -ball.verticalVelocity * gravity;
    } else {
      ball.verticalVelocity += ball.velocityIncrement;
    }

    // Bounce off the sides of the canvas
    if (ball.xPos + ball.radius > canvasWidth || ball.xPos - ball.radius < 0) {
      ball.horizontalVelocity = -ball.horizontalVelocity;
    }

    // Increase ball size when near the mouse, but cap it

    if (
      mousePosition.x > ball.xPos - 20 &&
      mousePosition.x < ball.xPos + 20 &&
      mousePosition.y > ball.yPos - 50 &&
      mousePosition.y < ball.yPos + 50 &&
      ball.radius < 70
    ) {
      ball.radius += 5;
    } else if (ball.radius > ball.initialRadius) {
      ball.radius -= 5;
    }
  };

  return ball;
}

let ballArray = Array.from({ length: 50 }, createBall);

// Animation loop
const animateBalls = () => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  ballArray.forEach((ball) => ball.update());
  requestAnimationFrame(animateBalls);
};

animateBalls();

// Add a new ball every 400ms and remove the oldest one
setInterval(() => {
  ballArray.push(createBall());
  ballArray.shift();
}, 400);
