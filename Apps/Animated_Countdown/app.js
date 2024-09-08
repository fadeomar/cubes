const numbers = document.querySelectorAll(".numbers span");
const counter = document.querySelector(".counter");
const finalMessage = document.querySelector(".final");
const replay = document.querySelector("#replay");

function runAnimation() {
  numbers.forEach((number, index) => {
    const lastIndex = numbers.length - 1;

    number.addEventListener("animationend", (e) => {
      if (e.animationName === "goIn" && index !== lastIndex) {
        number.classList.remove("in");
        number.classList.add("out");
      } else if (e.animationName === "goOut" && number.nextElementSibling) {
        number.nextElementSibling.classList.add("in");
      } else {
        counter.classList.add("hide");
        finalMessage.classList.add("show");
      }
    });
  });
}

runAnimation();

function reset() {
  counter.classList.remove("hide");
  finalMessage.classList.remove("show");

  numbers.forEach((number) => {
    number.classList.value = "";
  });

  numbers[0].classList.add("in");
}

replay.addEventListener("click", () => {
  reset();
  runAnimation();
});
