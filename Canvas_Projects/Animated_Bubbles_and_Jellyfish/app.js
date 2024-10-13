const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bubbles = [];
const plankton = [];
const jellyfish = [];

for (let i = 0; i < 50; i++) {
  bubbles.push({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: Math.random() * 0.5 + 0.5,
    radius: Math.random() * 5 + 2,
    color: "darkblue",
  });
}

for (let i = 0; i < 100; i++) {
  plankton.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    radius: Math.random() * 1 + 0.5,
    color: `blue`,
  });
}

for (let i = 0; i < 30; i++) {
  jellyfish.push({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: Math.random() * -0.5 - 0.2,
    radius: Math.random() * 20 + 10,
    color: `rgba(255, 0, 255, 0.2)`,
  });
}

function drawBubble(bubble) {
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
  ctx.fillStyle = bubble.color;
  ctx.fill();
}
function updateBubble(bubble) {
  bubble.x += bubble.vx;
  bubble.y -= bubble.vy;

  if (bubble.y < -bubble.radius) {
    bubble.y = canvas.height + bubble.radius;
    bubble.x = Math.random() * canvas.width;
  }

  if (bubble.x < 0) {
    bubble.x = canvas.width;
  }

  if (bubble.x > canvas.width) {
    bubble.x = 0;
  }
}

function drawPlankton(plankton) {
  ctx.beginPath();
  ctx.arc(plankton.x, plankton.y, plankton.radius, 0, Math.PI * 2);
  ctx.fillStyle = plankton.color;
  ctx.fill();
}

function updatePlankton(plankton) {
  plankton.x += plankton.vx;
  plankton.y += plankton.vy;

  if (plankton.x < 0) {
    plankton.x = canvas.width;
  }

  if (plankton.x > canvas.width) {
    plankton.x = 0;
  }

  if (plankton.y < 0) {
    plankton.y = canvas.height;
  }

  if (plankton.y > canvas.height) {
    plankton.y = 0;
  }
}

function drawJellyfish(jellyfish) {
  ctx.beginPath();
  ctx.arc(jellyfish.x, jellyfish.y, jellyfish.radius, 0, Math.PI * 2);
  ctx.fillStyle = jellyfish.color;
  ctx.fill();
}

function updateJellyfish(jellyfish) {
  jellyfish.x += jellyfish.vx;
  jellyfish.y += jellyfish.vy;

  if (jellyfish.x < 0) {
    jellyfish.x = canvas.width;
  }

  if (jellyfish.x > canvas.width) {
    jellyfish.x = 0;
  }

  if (jellyfish.y < -jellyfish.radius) {
    jellyfish.y = canvas.height + jellyfish.radius;
    jellyfish.x = Math.random() * canvas.width;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bubbles.forEach((bubble) => {
    updateBubble(bubble);
    drawBubble(bubble);
  });

  plankton.forEach((p) => {
    updatePlankton(p);
    drawPlankton(p);
  });

  jellyfish.forEach((j) => {
    updateJellyfish(j);
    drawJellyfish(j);
  });

  requestAnimationFrame(draw);
}

draw();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
