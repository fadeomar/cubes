const cube = document.querySelector(".cube");
let mouseX = 0;
let mouseY = 0;

const rotateValue = 270;

const handleMouseMove = (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  let rotateX = -(mouseY / window.innerHeight - 0.5) * rotateValue;
  let rotateY = (mouseX / window.innerWidth - 0.5) * rotateValue;

  cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

window.addEventListener("mousemove", handleMouseMove);
