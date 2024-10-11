const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numCircles = 50;
const circles = [];
const flowSpeedX = 1;

const trailLength = 30;
const trailFade = 0.05;

class Circle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 20 + 10;
    this.speed = Math.random() * 2 + 1;
    this.amplitude = Math.random() * 5 + 2;
    this.phase = Math.random() * Math.PI * 2;
    this.color = `rgba(0, 128, 255, ${Math.random() * 0.5 + 0.2})`;
    this.trail = [];
  }

  update() {
    this.phase += this.speed * 0.01;
    this.y += Math.sin(this.phase) * this.amplitude;
  }

  draw() {
    const perspective = 1 - this.y / canvas.height;
    ctx.globalAlpha = perspective * (1 - trailFade);

    for (let i = 0; i < this.trail.length; i++) {
      const trailPerspective = 1 - this.trail[i].y / canvas.height;
      const radius = Math.max(
        this.radius * trailPerspective * (1 - i / this.trail.length),
        0
      );
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const currentRadius = Math.max(this.radius * perspective, 0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > trailLength) {
      this.trail.shift();
    }
  }
}

// create circles
for (let i = 0; i < numCircles; i++) {
  circles.push(new Circle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const circle of circles) {
    circle.update();
    circle.draw();

    circle.x += flowSpeedX;
    if (circle.x > canvas.width + circle.radius) {
      circle.x = -circle.radius;
    }
  }

  requestAnimationFrame(animate);
}

animate();
