const color = document.querySelector("#color");
const createButton = document.querySelector("#createButton");
const list = document.querySelector("#list");

const createNoteElement = () => {
  // Create the main note container
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("note");

  // Create the close button
  const closeSpan = document.createElement("span");
  closeSpan.classList.add("close");
  closeSpan.textContent = "X"; // The "X" close text

  // Create the textarea
  const textarea = document.createElement("textarea");
  textarea.name = "content";
  textarea.id = "content";
  textarea.placeholder = "Write Content...";
  textarea.rows = 10;
  textarea.cols = 30;

  // Append the close button and textarea to the note div
  noteDiv.appendChild(closeSpan);
  noteDiv.appendChild(textarea);

  // Add color
  noteDiv.style.borderColor = color.value;

  return noteDiv;
};

createButton.addEventListener("click", () => {
  const newNote = createNoteElement();
  list.appendChild(newNote);
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    e.target.parentNode.remove();
  }
});

let cursor = {
  x: null,
  y: null,
};

let note = {
  dom: null,
  x: null,
  y: null,
};

document.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("note")) {
    cursor = {
      x: e.clientX,
      y: e.clientY,
    };

    note = {
      dom: e.target,
      x: e.target.getBoundingClientRect().left,
      y: e.target.getBoundingClientRect().top,
    };
  }
});

document.addEventListener("mousemove", (e) => {
  if (note.dom === null) return;

  if (e.target.classList.contains("note")) {
    let currentCursor = {
      x: e.clientX,
      y: e.clientY,
    };

    let distance = {
      x: currentCursor.x - cursor.x,
      y: currentCursor.y - cursor.y,
    };

    note.dom.style.left = note.x + distance.x + "px";
    note.dom.style.top = note.y + distance.y + "px";
    note.dom.style.cursor = "grab";
  }
});

document.addEventListener("mouseup", () => {
  if (note.dom === null) return;

  note.dom.style.cursor = "auto";
  note.dom = null;
});
