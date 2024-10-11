const container = document.querySelector(".container");
const cubes = document.querySelector(".cubes");

for (let i = 0; i < 400; i++) {
  const trigger = document.createElement("div");
  trigger.classList.add("trigger");
  container.insertBefore(trigger, container.firstChild);
}

for (let i = 0; i < 125; i++) {
  const cube = document.createElement("div");
  cube.classList.add("cube");

  const scale = document.createElement("div");
  scale.classList.add("scale");

  for (let j = 0; j < 6; j++) {
    const panel = document.createElement("div");
    panel.classList.add("panel");
    scale.appendChild(panel);
  }

  cube.appendChild(scale);
  cubes.appendChild(cube);
}

function generateCSS() {
  const style = document.createElement("style");
  document.head.appendChild(style);

  for (let i = 1; i <= 400; i++) {
    const rotateX = -88 + ((i - 1) % 20) * 4;
    const rotateY = -158 + Math.floor((i - 1) / 20) * 4;

    style.textContent += `
      .trigger:nth-child(${i}):hover ~ .monitor .camera.-x {
      transform: rotateX(${rotateX}deg);
      }

      .trigger:nth-child(${i}):hover ~ .monitor .camera.-y {
       transform: rotateY(${rotateY}deg);
      }
    `;
  }

  for (let i = 1; i <= 125; i++) {
    let translateX = 0;
    let translateY = 0;
    let translateZ = 0;
    let animationDuration = 0;
    let animationDelay = 0;

    const layer = Math.floor((i - 1) / 25);
    const row = Math.floor(((i - 1) % 25) / 5);
    const col = (i - 1) % 5;

    translateX = col * 50 - 100;
    translateY = row * 50 - 100;
    translateZ = layer * -50 + 100;

    animationDuration = 500 + (i % 10) * 50;
    animationDelay = (i - 1) * 20;

    style.textContent += `
      .cube:nth-child(${i}) {
        transform: translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px);
      }

      .cube:nth-child(${i}) .scale {
      animation: scale ${animationDuration}ms ${animationDelay}ms cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite alternate;
      
      }
    `;
  }
}

generateCSS();
