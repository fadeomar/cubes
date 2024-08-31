// create starts function

const stars = () => {
  const count = Math.floor(window.innerWidth / 10);
  const scene = document.querySelector(".scene");

  // Loop to generate stars dynamically
  for (let i = 0; i < count; i++) {
    // Create star element
    const star = document.createElement("i");
    // Random X position
    const x = Math.floor(Math.random() * window.innerWidth);
    // Faster animation duration
    const duration = Math.random() + 1;
    // Random star height
    const height = Math.random() * 100;

    star.style.left = `${x}px`;
    star.style.width = `1px`;
    star.style.height = `${50 + height}px`;
    star.style.animationDuration = `${duration}s`;

    // Append each star to the scene
    scene.appendChild(star);
  }
};

// Immediately invoke the stars function
stars();
