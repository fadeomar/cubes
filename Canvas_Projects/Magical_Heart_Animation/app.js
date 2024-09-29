const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

canvas.width = canvasWidth = 500;
canvas.height = canvasHeight = 500;

let angle = 0.04;
let angleStep = -0.07;
let patternFrequency = 5;
let isClockwise = true;

function drawHeart() {
  // Update the angle for the heart's shape
  angle += angleStep;

  const heartX =
    canvasWidth / 2 + ((canvasWidth - 25) / 2) * Math.pow(Math.sin(angle), 3);

  const heartY =
    canvasHeight / 2 -
    13 *
      (13 * Math.cos(angle) -
        5 * Math.cos(2 * angle) -
        2 * Math.cos(3 * angle));

  ctx.beginPath();
  ctx.moveTo(heartX, heartY);

  const randomHue = Math.random() * 360;
  ctx.strokeStyle = `hsl(${randomHue}, 100%, 50%)`;

  for (let t = 0; t < 2 * Math.PI; t += 0.01) {
    const offsetX = heartX + 8 * Math.cos(patternFrequency * t) * Math.cos(t);
    const offsetY = heartY + 8 * Math.cos(patternFrequency * t) * Math.sin(t);
    ctx.lineTo(offsetX, offsetY);
  }

  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, canvasHeight / 2);
  ctx.lineTo(heartX, heartY);
  ctx.stroke();
  ctx.closePath();

  if (angle < -Math.PI * 2 || angle > Math.PI * 2) {
    isClockwise = !isClockwise;

    angleStep = isClockwise ? 0.05 : -0.07;

    angle = 0.04;
  }

  requestAnimationFrame(drawHeart);
}

requestAnimationFrame(drawHeart);
