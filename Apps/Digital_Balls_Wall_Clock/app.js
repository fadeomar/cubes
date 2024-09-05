setInterval(() => {
  let circleHours = document.querySelector("#circle-hours");
  let circleMinutes = document.querySelector("#circle-minutes");
  let circleSeconds = document.querySelector("#circle-seconds");

  let sec_dot = document.querySelector(".sec_dot");
  let min_dot = document.querySelector(".min_dot");
  let hr_dot = document.querySelector(".hr_dot");

  let hours = document.querySelector(".hours");
  let minutes = document.querySelector(".minutes");
  let seconds = document.querySelector(".seconds");
  let timeZone = document.querySelector("#time-zone");

  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();

  let isAm = h >= 12 ? "PM" : "AM";

  timeZone.textContent = isAm;

  // convert 24hr clock to 12 hr clock system
  if (h > 12) {
    h = h - 12;
  }
  // add zero before single digit
  h = h < 10 ? `0${h}` : h;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;

  circleHours.style.strokeDashoffset = 510 - (510 * h) / 12;
  circleMinutes.style.strokeDashoffset = 630 - (630 * m) / 60;
  circleSeconds.style.strokeDashoffset = 760 - (760 * s) / 60;

  // 360 / 60s = 6
  sec_dot.style.transform = `rotateZ(${s * 6}deg)`;

  // 360 / 60m = 6
  min_dot.style.transform = `rotateZ(${m * 6}deg)`;

  // 360 / 12hr = 30
  hr_dot.style.transform = `rotateZ(${h * 30}deg)`;

  // text time
  hours.textContent = h;
  minutes.textContent = m;
  seconds.textContent = s;
}, 500);
