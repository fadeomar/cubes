const textEl = document.querySelector("#text");
const speedEl = document.querySelector("#speed");

const text = "We Love programming!";

let index = 1;

let speed = 300 / speedEl.value;

let direction = "ltr";

function writeText() {
  if (index === 0) {
    direction = "ltr";
    speed = 300 / speedEl.value;
  }

  textEl.textContent = text.slice(0, index);

  if (direction === "ltr") {
    index++;
  } else {
    index--;
  }

  if (index > text.length) {
    direction = "rtl";
    speed = 100 / speedEl.value;
  }

  setTimeout(writeText, speed);
}

speedEl.addEventListener("input", (e) => {
  speed = 300 / e.target.value;
});

writeText();
