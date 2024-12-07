// Utility Functions

const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const getRandomElement = (...elements) => {
  return elements[getRandomInteger(0, elements.length - 1)];
};

const generateRandomCharacter = () => {
  return String.fromCharCode(
    getRandomElement(
      getRandomInteger(0x0041, 0x005a), // Uppercase English letters (A-Z)

      getRandomInteger(0x0061, 0x007a), // Lowercase English letters (a-z)

      getRandomInteger(0x0020, 0x003f)
    )
  );
};

const executeAtInterval = (callback, interval) => {
  let lastExecutionTime = Date.now();

  const loop = () => {
    if (Date.now() - lastExecutionTime >= interval) {
      callback();
      lastExecutionTime = Date.now();
    }
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
};

// Char Class
class Character {
  constructor() {
    this.element = document.createElement("span");
    this.updateCharacter();
  }

  updateCharacter() {
    this.element.textContent = generateRandomCharacter();
  }
}

// Trail Class
class CharacterTrail {
  constructor(characterList = [], options = {}) {
    this.characterList = characterList;
    this.settings = { size: 10, offset: 0, ...options };
    this.trailBody = [];
    this.updateTrail();
  }

  traverseTrail(callback) {
    this.trailBody.forEach((character, index) => {
      const isLastCharacter = index === this.trailBody.length - 1;
      if (character) callback(character, index, isLastCharacter);
    });
  }

  updateTrail() {
    const { size, offset } = this.settings;
    this.trailBody = Array.from(
      { length: size },
      (_, i) => this.characterList[offset + i - size + 1]
    );
    this.settings.offset =
      (offset + 1) % (this.characterList.length + size - 1);
  }
}

// Rain Column class
class RainColumn {
  constructor({ targetContainer, rows }) {
    this.element = document.createElement("p");
    this.createCharacters(rows);

    if (targetContainer) {
      targetContainer.appendChild(this.element);
    }

    this.startRainAnimation();
  }

  createCharacters(rowCount = 20) {
    const fragment = document.createDocumentFragment();
    const characters = Array.from({ length: rowCount }, () => {
      const char = new Character();
      fragment.appendChild(char.element);

      // Mutate characters periodically
      if (Math.random() < 0.5) {
        executeAtInterval(
          () => char.updateCharacter(),
          getRandomInteger(1000, 5000)
        );
      }

      return char;
    });

    this.trail = new CharacterTrail(characters, {
      size: getRandomInteger(10, 30),
      offset: getRandomInteger(0, 100),
    });

    this.element.appendChild(fragment);
  }

  startRainAnimation() {
    const { trail } = this;
    const trailLength = trail.trailBody.length;
    const animationDelay = getRandomInteger(10, 100);

    executeAtInterval(() => {
      trail.updateTrail();

      trail.traverseTrail((character, index, isLastCharacter) => {
        character.element.style.color = `hsl(136, 100%, ${
          (85 / trailLength) * (index + 1)
        }%)`;

        if (isLastCharacter) {
          character.updateCharacter();
          character.element.style = `
            color: hsl(136, 100%, 85%);
            text-shadow: 
              0 0 0.5em #fff, 
              0 0 0.5em currentColor;
          `;
        }
      });
    }, animationDelay);
  }
}

// Main Execution
const mainContainer = document.querySelector("main");
Array.from(
  { length: 50 },
  () => new RainColumn({ targetContainer: mainContainer, rows: 50 })
);
