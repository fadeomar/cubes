const leaf = document.querySelector(".leaf");

for (let i = 0; i < 5; i++) {
  const clover = document.createElement("div");
  clover.classList.add("clover");
  clover.style.transform = `rotate(${(i * 360) / 5}deg) translate(83px)`;

  for (let j = 0; j < 50; j++) {
    const sprout = document.createElement("div");
    sprout.classList.add("sprout");
    sprout.style.transform = `rotate(${(j * 223) / 100}deg) translate(100%)`;

    const circle = document.createElement("i");
    circle.style.backgroundColor = `hsla(${55 - (j * 50) / 50}, 100%, 50%, 1)`;

    sprout.appendChild(circle);
    clover.appendChild(sprout);
  }
  leaf.appendChild(clover);
}
