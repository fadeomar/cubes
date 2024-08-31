const timeRef = document.querySelector(".timer-display");
const startButton = document.getElementById("start-timer");
const pauseButton = document.getElementById("pause-timer");
const resetButton = document.getElementById("reset-timer");

let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;

let timeId = null;

startButton.addEventListener("click", () => {
  if (timeId !== null) {
    clearInterval(timeId);
  }

  timeId = setInterval(updateTimerDisplay, 10);
});

pauseButton.addEventListener("click", () => {
  clearInterval(timeId);
});

resetButton.addEventListener("click", () => {
  clearInterval(timeId);
  resetTime();
});

function resetTime() {
  milliseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;

  timeRef.textContent = formatTime();
}

function formatTime() {
  const h = padZero(hours);
  const m = padZero(minutes);
  const s = padZero(seconds);
  const ms = padZero(milliseconds);
  return `${h} : ${m} : ${s} : ${ms}`;
}

function padZero(num, size = 2) {
  return num.toString().padStart(size, "0");
}

function updateTimerDisplay() {
  milliseconds += 10;

  // handle time overflow
  if (milliseconds >= 100) {
    milliseconds = 0;
    seconds++;
  }

  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }

  if (minutes >= 60) {
    minutes = 0;
    hours++;
  }

  timeRef.textContent = formatTime();
}
