const container = document.querySelector("#container");
const text = "WAVY TEXT ANIMATION | CUBES";

for (let i = 0; i < text.length; i++) {
  const letterSpan = document.createElement("span");

  letterSpan.style.setProperty("--i", i + 1);
  letterSpan.textContent = text[i];

  container.appendChild(letterSpan);
}
