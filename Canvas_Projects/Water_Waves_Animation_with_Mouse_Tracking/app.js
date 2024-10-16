const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const waves = [];
const count = 12;
const perspective = 300;
const maxCircleRadius = 12;
const pointSpacing = 20;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

for (let i = 0; i < count; i++) {
  waves.push({
    y: canvas.height / 2 - 200 + Math.random() * 400,
    length: 0.002 + Math.random() * 0.008,
    amplitude: 50 + Math.random() * 0.015,
    phase: Math.random() * perspective,
    baseY: 0,
    radiusOffset: Math.random() * maxCircleRadius,
    z: Math.random() * maxCircleRadius,
    frequency: 0.005 + Math.random() * 0.015,
  });

  waves[i].baseY = waves[i].y;
}

let time = 0;

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  waves.forEach((wave, index) => {
    ctx.lineWidth = 2;
    const scale = perspective / (perspective + wave.z);
    wave.y = wave.baseY + Math.sin(time * 0.001 + wave.z) * 20;
    const y = wave.y * scale + (canvas.height / 2) * (1 - scale);

    for (let i = 0; i < canvas.width; i += pointSpacing) {
      const distanceX = mouseX - i;
      const distanceY =
        mouseY -
        (y +
          Math.sin(i * wave.length + wave.phase) *
            wave.amplitude *
            Math.sin(wave.phase) *
            scale);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const circleRadius =
        maxCircleRadius -
        Math.abs(Math.sin(time * 0.01 + index)) * maxCircleRadius;

      const newX = i + (distanceX / distance) * Math.min(50, 1000 / distance);
      const newY =
        y +
        Math.sin(i * wave.length + wave.phase) *
          wave.amplitude *
          Math.sin(wave.phase) *
          scale +
        (distanceY / distance) * Math.min(50, 1000 / distance);

      ctx.beginPath();
      ctx.arc(newX, newY, circleRadius + wave.radiusOffset, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(0, 150, 255, 1)`;
      ctx.fill();
    }

    wave.phase += wave.frequency;
  });

  time++;
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  waves.forEach((wave) => {
    wave.y = canvas.height / 2 - 200 + Math.random() * 400;
    wave.baseY = wave.y;
  });
});
