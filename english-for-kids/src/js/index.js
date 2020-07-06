import { Game, statistics } from './playMode';
import { changeCard, cards } from './changerCards';

let newGame = null;

function gameDestroyer() {
  if (newGame) {
    newGame.clearPage();
    newGame = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // header
  const navigation = document.querySelector('.burger-menu__navigation');
  const checkBoxLabel = document.querySelector('div.switch-btn > label');
  // Pages
  const mainPage = document.querySelector('.main-page');
  const categoryPage = document.querySelector('.category-page');
  // Button
  const burgerBtn = document.querySelector('.burger-menu__btn');
  const gameBtn = document.querySelector('.game-btn');
  const resetBtn = document.querySelector('.statistics__btn-reset');
  const repeatDifficultWords = document.querySelector('.statistics__btn-repeat');
  // Other
  const starContainer = document.querySelector('.star-container');
  const table = document.querySelector('.statistics');

  statistics.init(); // Load data to a statistics-page
  // Show || hide menu
  document.addEventListener('click', (event) => {
    const { target } = event;

    if (target.closest('.burger-menu__btn')) {
      burgerBtn.classList.toggle('active');
      navigation.classList.toggle('active');
    } else if (target !== navigation) {
      burgerBtn.classList.remove('active');
      navigation.classList.remove('active');
    }
  });

  // Click on link (navigation or main-page)
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');

    if (link) {
      gameDestroyer();
      changeCard(link);
    }
  });

  categoryPage.addEventListener('click', (event) => {
    let { target } = event;
    // Check play (true) or train (false) mode
    const checkBoxVerify = document.querySelector('#checkbox').checked;
    // Check event.target: "start-game" button, reverse button on card, section with cards
    const gameBtnVerify = target.classList.contains('game-btn');
    const reverseBtnVerify = target.className === 'title__reverse';
    const sectionVerify = target.tagName.toLowerCase() === 'section';
    const verify = [gameBtnVerify, reverseBtnVerify, sectionVerify].findIndex((item) => item);

    switch (verify) {
      case 0: // gameBtnVerify - true
        if (!newGame) {
          const gameResult = document.querySelector('.game-result');

          newGame = new Game(cards, starContainer, gameResult, gameBtn);
          newGame.startGame();

          gameBtn.classList.add('repeat');
          gameBtn.innerHTML = '&#8634';
        } else {
          newGame.getCurrentCard();
        }
        break;
      case 1: { // reverseBtnVerify - true
        const card = target.closest('.category-card');
        const cardWrapper = card.closest('.card-wrapper');
        const handler = function cardBlur() {
          card.classList.remove('flip');
          cardWrapper.removeEventListener('mouseleave', handler);
        };

        card.classList.add('flip');
        cardWrapper.addEventListener('mouseleave', handler);
        break;
      }
      case 2: // sectionVerify - true; we don't do anything
        break;
      default:
        target = target.closest('.category-card');

        if (!checkBoxVerify) { // if train mode
          cards.getSound(target);
        } else if (newGame) { // if play mode and start a new game
          newGame.checkCard(target);
        }
        break;
    }
  });

  table.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'th') {
      statistics.sortTable(event.target);
    }
  });

  resetBtn.addEventListener('click', () => {
    statistics.resetData();
  });

  repeatDifficultWords.addEventListener('click', () => {
    statistics.getDifficultWords();
  });

  checkBoxLabel.addEventListener('click', () => {
    mainPage.classList.toggle('play-mode');
    categoryPage.classList.toggle('play-mode');
    starContainer.classList.toggle('play-mode');
    document.querySelector('.container').classList.toggle('play-mode');
    gameDestroyer(); // Destroy game if you clicked on switch-btn during the game
  });
});
