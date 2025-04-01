const cardsData = [
  {
    name: "cherries",
    image: "https://i.ibb.co/yBS25y6Q/cherries.png",
  },
  {
    image: "https://i.ibb.co/6p60yRJ/grapes.png",
    name: "grapes",
  },
  {
    image: "https://i.ibb.co/prdJyCws/lemon.png",
    name: "lemon",
  },
  {
    image: "https://i.ibb.co/S7K5SQ7g/orange.png",
    name: "orange",
  },
  {
    image: "https://i.ibb.co/6ckJYt9C/pineapple.png",
    name: "pineapple",
  },
  {
    image: "https://i.ibb.co/PvfM1fbQ/strawberry.png",
    name: "strawberry",
  },
  {
    image: "https://i.ibb.co/jk3TTM6p/tomato.png",
    name: "tomato",
  },
  {
    image: "https://i.ibb.co/FkHyF1r6/watermelon.png",
    name: "watermelon",
  },
  {
    name: "chili",
    image: "https://i.ibb.co/XrmN2WfR/chili.png",
  },
];

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

cards = [...cardsData, ...cardsData];
shuffleCards();
generateCards();

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
