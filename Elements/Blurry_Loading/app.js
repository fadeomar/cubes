const loadText = document.querySelector(".loading_text");
const bg = document.querySelector(".background");

let load = 0;

let int = setInterval(blurring, 30);

function blurring() {
  load++;

  if (load > 99) {
    clearInterval(int);
  }

  loadText.textContent = `${load}%`;
  loadText.style.opacity = scale(load, 0, 100, 1, 0);
  bg.style.filter = `blur(${scale(load, 0, 100, 30, 0)}px)`;
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  // Calculate the range of input values
  const inputRange = in_max - in_min;

  // Calculate the range of output values
  const outputRange = out_max - out_min;

  // Scale the input number to the output range
  const scaledValue = ((num - in_min) / inputRange) * outputRange + out_min;

  return scaledValue;
};
