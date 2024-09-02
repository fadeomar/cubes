const hourHand = document.querySelector("#hour-hand");

const minuteHand = document.querySelector("#minute-hand");

const secondHand = document.querySelector("#second-hand");

function clockTick() {
  const date = new Date();
  const seconds = date.getSeconds() / 60;
  const minutes = (seconds + date.getMinutes()) / 60;
  const hours = (minutes + date.getHours()) / 12;

  rotateLockHand(secondHand, seconds);
  rotateLockHand(minuteHand, minutes);
  rotateLockHand(hourHand, hours);
}

function rotateLockHand(element, time) {
  element.style.setProperty("--rotate", time * 360);
}

setInterval(clockTick, 1000);
