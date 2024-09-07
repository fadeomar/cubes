const body = document.querySelector("body");

const generateButton = document.querySelector("#generate_button");

const result = document.querySelector(".result");

result.style.opacity = 0;

function generateRandomColor() {
  const inters = [1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  let color = "#";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * inters.length);
    const currentItem = inters[randomIndex];
    color = color + currentItem;
  }
  console.log(color);
  return color;
}

function generateDirection() {
  const inters = [
    "top left",
    "top right",
    "bottom left",
    "bottom right",
    "left top",
    "left bottom",
    "right top",
    "right bottom",
  ];
  const randomIndex = Math.floor(Math.random() * inters.length);
  const currentItem = inters[randomIndex];
  return currentItem;
}

function generateLinearGradient() {
  const color1 = generateRandomColor();
  const color2 = generateRandomColor();
  const direction = generateDirection();

  result.style.opacity = 1;

  return `linear-gradient(to ${direction}, ${color1}, ${color2})`;
}

generateButton.addEventListener("click", () => {
  body.style.backgroundImage = generateLinearGradient();
  result.textContent = generateLinearGradient();
});
