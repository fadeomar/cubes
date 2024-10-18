let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");

let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let hiscoreval = 0;

const food = { x: 6, y: 7 };

// elements:
const hiscoreBox = document.querySelector("#hiscoreBox");
const scoreBox = document.querySelector("#scoreBox");
const board = document.querySelector("#board");

function main(ctime) {
  requestAnimationFrame(main);

  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // If you bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // if you bump into the wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }

  return false;
}

function gameEngine() {
  // Updating the snake array & Food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    alert("Game Over, Press any key to play again!");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
  }

  // after eat food, increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscoreval", JSON.stringify(hiscoreval));
      hiscoreBox.textContent = `top score: ${hiscoreval}`;
    }
    scoreBox.textContent = `Score: ${score}`;

    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });

    let a = 2;
    let b = 17;

    food.x = Math.round(a + (b - a) * Math.random());
    food.y = Math.round(a + (b - a) * Math.random());
  }

  // Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Display the snake
  board.textContent = "";
  snakeArr.forEach((item, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = item.y;
    snakeElement.style.gridColumnStart = item.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // display the food
  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.append(foodElement);
}

let hiScore = localStorage.getItem("hiscoreval");
if (!!hiScore && hiScore > 0) {
  hiscoreval = JSON.parse(hiScore);
  hiscoreBox.textContent = `top Score: ${hiScore}`;
} else {
  hiscoreval = 0;
  localStorage.setItem("hiscoreval", JSON.stringify(hiscoreval));
}

requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
  inputDir = { x: 0, y: 1 };
  moveSound.play();

  switch (e.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;

    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;

    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;

    default:
      break;
  }
});

let up = document.querySelector(".btn-1");
let left = document.querySelector(".btn-2");
let right = document.querySelector(".btn-3");
let down = document.querySelector(".btn-4");

function control(e) {
  if (e.keycode === 39) {
    inputDir.x = 1;
    inputDir.y = 0;
  } else if (e.keycode === 38) {
    inputDir.x = 0;
    inputDir.y = -1;
  } else if (e.keycode === 37) {
    inputDir.x = -1;
    inputDir.y = 0;
  } else if (e.keycode === 40) {
    inputDir.x = 0;
    inputDir.y = 1;
  }
}

up.addEventListener("click", () => {
  moveSound.play();
  inputDir = { x: 0, y: -1 };
});

down.addEventListener("click", () => {
  moveSound.play();
  inputDir = { x: 0, y: 1 };
});

left.addEventListener("click", () => {
  moveSound.play();
  inputDir = { x: -1, y: 0 };
});

right.addEventListener("click", () => {
  moveSound.play();
  inputDir = { x: 1, y: 0 };
});
