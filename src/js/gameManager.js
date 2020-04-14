import Game from './playMode.js';

let newGame = null;

const gameManager = (condition, ...controlElements) => {
  if (!condition) {
    newGame = new Game(...controlElements);
    newGame.startGame();
  } else {
    newGame.clearPage();
    newGame = null;
  }
};

export { newGame, gameManager };
