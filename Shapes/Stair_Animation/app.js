const windowDiv = document.querySelector("#window");

for (let i = 0; i < 20; i++) {
  const step = document.createElement("div");
  step.classList.add("step");
  const step_inner = document.createElement("div");
  step_inner.classList.add("step_inner");

  const step_top = document.createElement("div");
  step_top.classList.add("step_top");

  const step_side = document.createElement("div");
  step_side.classList.add("step_side");
  step_inner.appendChild(step_top);
  step_inner.appendChild(step_side);

  step.appendChild(step_inner);

  windowDiv.appendChild(step);
}

//  Apply animations to steps

for (let i = 1; i <= 100; i++) {
  const delay = -(i * 500);

  const stepElement = windowDiv.querySelector(`.step:nth-child(${i})`);

  if (stepElement) {
    stepElement.style.animation = `stepAnimation 10000ms ${delay}ms linear infinite`;

    const stepSide = stepElement.querySelector("step_side");

    if (stepSide) {
      stepSide.style.setProperty(
        "--animation-before",
        `stepColor 10000ms ${delay}ms linear infinite`
      );
      stepSide.style.setProperty(
        "--animation-after",
        `stepRefrection 10000ms ${delay}ms linear infinite`
      );
    }

    const stepTop = stepElement.querySelector(".step_top");
    if (stepTop) {
      stepTop.style.setProperty(
        "--animation-top-before",
        `stepShadow 10000ms ${delay}ms linear infinite`
      );

      stepTop.style.setProperty(
        "--animation-top-after",
        `stepRefrection 10000ms ${delay}ms linear infinite`
      );
    }
  }
}
