const container = document.querySelector(".container");

const createItems = () => {
  for (let i = 0; i < 700; i++) {
    const item = document.createElement("div");

    const randomNumber = Math.floor(Math.random() * 10) + 4;

    item.style.animationDuration = `${randomNumber}s`;

    container.appendChild(item);
  }
};

createItems();
