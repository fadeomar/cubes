const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numParticles = 1500;
const particles = [];
const mouse = { x: null, y: null };
const escapeRadius = 100;

for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    originalVx: (Math.random() - 0.5) * 0.5,
    originalVy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 3 + 1,
    color: "lightblue",
  });
}

function drawParticle(particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
}

function updateParticle(particle) {
  const dx = particle.x - mouse.x;
  const dy = particle.y - mouse.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < escapeRadius) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
  } else {
    // Slowly return to original speed
    particle.vx += (particle.originalVx - particle.vx) * 0.05;
    particle.vy += (particle.originalVy - particle.vy) * 0.05;
  }

  particle.x += particle.vx;
  particle.y += particle.vy;

  if (particle.x < 0) particle.x = canvas.width;
  if (particle.x > canvas.width) particle.x = 0;
  if (particle.y < 0) particle.y = canvas.height;
  if (particle.y > canvas.height) particle.y = 0;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    updateParticle(p);
    drawParticle(p);
  });

  requestAnimationFrame(draw);
}

draw();

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
