const boxesContainer = document.getElementById("boxes");
const button = document.getElementById("button");

// Toggle between small and big boxes container
button.addEventListener("click", () => {
  boxesContainer.classList.toggle("big");
});

const createBoxes = () => {
  const boxSize = 125;
  const gridSize = 4;
  const totalBoxes = gridSize * gridSize;

  for (let index = 0; index < totalBoxes; index++) {
    const box = document.createElement("div");
    box.classList.add("box");

    // Calculate row (i) and column (j) based on the single loop index
    const i = Math.floor(index / gridSize); // Row
    const j = index % gridSize; // Column

    const x = -j * boxSize;
    const y = -i * boxSize;
    box.style.backgroundPosition = `${x}px ${y}px`;
    boxesContainer.appendChild(box);
  }
};

createBoxes();
