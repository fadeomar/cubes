const bodywaves = document.querySelector(".bodywaves");

for (let i = 0; i < 50; i++) {
  const wave = document.createElement("div");
  wave.classList.add("wave");

  const top = Math.random() * 30;
  const left = Math.random() * 100 - 50;
  const delay = Math.random() * 3333 - 1500;
  const size = Math.random() * 40 - 15;
  wave.style.width = `${size}px`;
  wave.style.height = `${size}px`;
  wave.style.background = "white";
  wave.style.borderRadius = "50%";
  wave.style.top = `${top}px`;
  wave.style.left = `${left}px`;
  wave.style.animationDelay = `${delay}ms`;

  bodywaves.appendChild(wave);
}
