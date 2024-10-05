const canvas = document.getElementById("neonCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createNeonLine() {
  const neonLine = {
    x: -100, // Start all lines from just outside the left of the screen
    y: Math.random() * canvas.height * 2 - 200, // Random Y position
    length: Math.random() * 100 + 50, // Random length
    speed: Math.random() * 1 + 2, // Random speed
    angle: Math.PI * 0.1,
    hue: Math.random() * 360, // Start with a random hue
    lineWidth: Math.random() * 5 + 2, // Random line thickness
    delay: Math.random() * 2000, // Random delay
    startTime: Date.now(), // When the line was created
  };

  neonLine.draw = function () {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + Math.cos(this.angle) * this.length,
      this.y + Math.sin(this.angle) * this.length
    );

    const color = `hsl(${this.hue}, 100%, 50%)`;
    ctx.strokeStyle = color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = "round";
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.stroke();
  };

  neonLine.update = function () {
    const currentTime = Date.now();
    if (currentTime - this.startTime < this.delay) return;

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.hue += 1;

    if (this.hue >= 360) this.hue = 0;

    if (
      this.x > canvas.width + 100 ||
      this.y > canvas.height ||
      this.y < -200
    ) {
      this.reset();
    }
  };

  neonLine.reset = function () {
    this.x = -100;
    this.y = Math.random() * canvas.height * 2 - 200;
    this.length = Math.random() * 100 + 50;
    this.speed = Math.random() * 1 + 2;

    this.angle = Math.PI * 0.1;

    // Reset the hue for a new color
    this.hue = Math.random() * 360;

    this.lineWidth = Math.random() * 5 + 2;
    this.startTime = Date.now(); // Reset the start time for the delay
    this.delay = Math.random() * 2000; // New random delay for the reset line
  };

  return neonLine;
}

let neonLines = [];
for (let i = 0; i < 100; i++) {
  neonLines.push(createNeonLine());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  neonLines.forEach((line) => {
    line.draw();
    line.update();
  });

  requestAnimationFrame(animate);
}

animate();

// background code

const stars = [];
const starCount = 100;

for (let i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    alpha: Math.random(),
  });
}

function drawBackground() {
  ctx.fillStyle = "#2c2c2c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStars() {
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  });
}

function updateStars() {
  stars.forEach((star) => {
    star.alpha += (Math.random() - 0.5) * 0.02;

    if (star.alpha < 0) star.alpha = 0;
    if (star.alpha > 1) star.alpha = 1;
  });
}

function drawBackgroundGradient() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

  gradient.addColorStop(0, "#2c2c2c");
  gradient.addColorStop(0.33, "#4b0082");
  gradient.addColorStop(0.66, "#8a2be2");
  gradient.addColorStop(1, "#ff00ff");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animateBg() {
  drawBackground();
  drawStars();
  updateStars();

  neonLines.forEach((line) => {
    line.draw();
    line.update();
  });

  requestAnimationFrame(animateBg);
}

animateBg();
