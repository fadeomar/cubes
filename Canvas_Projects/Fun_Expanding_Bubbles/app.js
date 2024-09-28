// SETTING UP THE CANVAS
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// SETTING UP THE CONTEXT
const context = canvas.getContext("2d");
const mousePosition = {
  // MOUSE POSITION
  x: undefined,
  y: undefined,
};

const maximumRadius = 40; // MAXIMUM RADIUS CONTROLS MOUSE HOVER SIZE

const colors = ["#B22F3E", "#FFFA77", "#FF5D70", "#369BCC", "#023852"];

// LISTEN FOR MOUSE MOVEMENT
window.addEventListener("mousemove", (event) => {
  mousePosition.x = event.x;
  mousePosition.y = event.y;
});

// CREATE RESPONSIVE CANVAS
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initializeCircles();
});

// CIRCLE FACTORY FUNCTION
function createCircle(x, y, velocityX, velocityY, radius) {
  const initialRadius = radius;
  const color = colors[Math.floor(Math.random() * colors.length)];

  function draw() {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);

    // Adding fill color for the circle
    context.fillStyle = color;
    context.fill();

    // Adding border (stroke) to the circle
    context.strokeStyle = "#333"; // Border color (black)
    context.lineWidth = 0.5; // Border thickness
    context.stroke();
  }

  function update() {
    // Bounce off the walls
    if (x + radius > innerWidth || x - radius < 0) {
      velocityX = -velocityX;
    }

    if (y + radius > innerHeight || y - radius < 0) {
      velocityY = -velocityY;
    }

    x += velocityX;
    y += velocityY;

    // Mouse interactivity: expand circle when near the mouse
    const distanceToMouseX = mousePosition.x - x;
    const distanceToMouseY = mousePosition.y - y;
    if (Math.abs(distanceToMouseX) < 60 && Math.abs(distanceToMouseY) < 60) {
      if (radius < maximumRadius) {
        radius += 1;
      }
    } else if (radius > initialRadius) {
      radius -= 1;
    }

    draw();
  }

  return { draw, update };
}

// CIRCLE ARRAY / INITIALIZATION
let circles = [];

function initializeCircles() {
  circles = []; // Clear the array to ensure only 'X' circles populate
  for (let i = 0; i < 800; i++) {
    const radius = Math.random() * 5 + 1; // Controls circle radius
    const x = Math.random() * (innerWidth - radius * 2) + radius;
    const y = Math.random() * (innerHeight - radius * 2) + radius;
    const velocityX = (Math.random() - 0.5) * 1; // Controls X velocity
    const velocityY = (Math.random() - 0.5) * 1; // Controls Y velocity
    // Add new circle to the array
    circles.push(createCircle(x, y, velocityX, velocityY, radius));
  }
}

// REQUEST AN ANIMATION FRAME
function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, innerWidth, innerHeight); // Clear the canvas before each frame
  circles.forEach((circle) => circle.update()); // Update and draw each circle
}

initializeCircles();
animate();
