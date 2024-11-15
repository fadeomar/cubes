const panel = document.querySelector(".panel");
const buttons = document.querySelectorAll(".radio");
const rotationSlider = document.getElementById("rotation");
const rotationValue = document.getElementById("rotation-value");

// update transform style
buttons.forEach((button) => {
  button.addEventListener("change", () => {
    panel.style.setProperty("--transform-style", button.value);
  });
});

// update rotation
rotationSlider.addEventListener("input", () => {
  const rotateY = rotationSlider.value;
  panel.style.transform = `rotateY(${rotateY}deg)`;
  rotationValue.textContent = rotateY;
});
