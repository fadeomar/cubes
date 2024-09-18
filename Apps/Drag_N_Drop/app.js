const fill = document.querySelector(".fill");
const empties = document.querySelectorAll(".empty");

const dragStart = (element) => {
  element.classList.add("hold");
  setTimeout(() => (element.className = "invisible"), 0);
};

const dragEnd = (element) => {
  element.className = "fill";
};

const dragOver = (e) => {
  e.preventDefault();
};

const dragEnter = (e) => {
  e.preventDefault();
  e.target.classList.add("hovered");
};

const dragLeave = (e) => {
  e.target.className = "empty";
};

const dragDrop = (empty, fill) => {
  empty.className = "empty";
  empty.append(fill);
};

fill.addEventListener("dragstart", () => dragStart(fill));
fill.addEventListener("dragend", () => dragEnd(fill));

empties.forEach((empty) => {
  empty.addEventListener("dragover", dragOver);
  empty.addEventListener("dragenter", dragEnter);
  empty.addEventListener("dragleave", dragLeave);
  empty.addEventListener("drop", () => dragDrop(empty, fill));
});
