document.addEventListener("DOMContentLoaded", () => {
  const flower = document.getElementById("flower");
  const pollenLayer = document.getElementById("pollen");
  const note = document.getElementById("note");

  let isBloomed = false;
  let hintHidden = false;

  function setBloom(value) {
    document.documentElement.style.setProperty("--bloom", String(value));
  }

  function hideHintOnce() {
    if (hintHidden) return;
    hintHidden = true;
    note.classList.add("is-hidden");
  }

  function spawnPollen(count = 18) {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "pollenDot";

      dot.style.setProperty("--x", `${Math.random() * 60 - 30}px`);
      dot.style.setProperty("--y", `${Math.random() * 28 - 14}px`);
      dot.style.animationDelay = `${Math.random() * 160}ms`;

      pollenLayer.appendChild(dot);
    }
  }

  function toggleBloom() {
    hideHintOnce();

    isBloomed = !isBloomed;
    flower.setAttribute("aria-pressed", String(isBloomed));

    setBloom(isBloomed ? 1 : 0);
    if (isBloomed) spawnPollen(18);
  }

  flower.addEventListener("click", toggleBloom);

  flower.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBloom();
    }
  });

  setBloom(0);
});
