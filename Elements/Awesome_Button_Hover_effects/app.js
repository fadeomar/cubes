const buttons = document.querySelectorAll(".button");

buttons.forEach((button) => {
  const text = button.textContent.trim();
  // Clear the original text content
  button.textContent = "";

  [...text].forEach((char) => {
    const span = document.createElement("span");

    // Add a non-breaking space for spaces
    const spanLetter = char === " " ? "\u00A0" : char;
    span.textContent = spanLetter;

    // append span elements
    button.appendChild(span);
  });

  const spans = button.querySelectorAll("span");

  button.addEventListener("mouseenter", () => {
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add("hover");
      }, index * 50);
    });
  });

  button.addEventListener("mouseleave", () => {
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.classList.remove("hover");
      }, index * 50);
    });
  });
});
