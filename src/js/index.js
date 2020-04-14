import Game from './playMode.js';
import { changeCard, cards } from './changerCards.js';

let newGame = null;

function gameDestroyer(condition) {
  if (condition) {
    newGame.clearPage();
    newGame = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const gameBtn = document.querySelector('.game-btn');
  const mainPage = document.querySelector('.main-page');
  const categoryPage = document.querySelector('.category-page');
  const burgerBtn = document.querySelector('.burger-menu__btn');
  const navigation = document.querySelector('.burger-menu__navigation');
  const starContainer = document.querySelector('.star-container');
  const checkBoxLabel = document.querySelector('div.switch-btn > label');

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
          const gameResult = document.querySelector('.result');

          newGame = new Game(cards, starContainer, gameResult, gameBtn);
          newGame.startGame();

          gameBtn.classList.add('repeat');
          gameBtn.innerHTML = '&#8634';
        } else {
          newGame.getCurrentCard();
        }
        break;
      case 1: { // reverseBtnVerify - true
        const card = target.parentElement.parentElement; // reverse-btn -> its container -> card
        const handler = function cardBlur() {
          card.classList.remove('flip');
          card.removeEventListener('mouseleave', handler);
        };

        card.classList.add('flip');
        card.addEventListener('mouseleave', handler);

        break;
      }
      case 2: // sectionVerify - true; we don't do anything
        break;
      default:
        while (!target.classList.contains('category-card')) {
          target = target.parentElement;
        }

        if (!checkBoxVerify) { // if train mode
          cards.getSound(target);
        } else if (newGame) { // if play mode and start a new game
          newGame.checkCard(target);
        }
        break;
    }
  });

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('burger-menu__btn_active');
    navigation.classList.toggle('burger-menu__navigation_active');
  });

  navigation.querySelector('nav').addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'a') {
      gameDestroyer(newGame); // Destroy game if you clicked on link during the game
      changeCard(event.target);
    }

    burgerBtn.classList.toggle('burger-menu__btn_active');
    navigation.classList.toggle('burger-menu__navigation_active');
  });

  mainPage.addEventListener('click', (event) => {
    if (event.target.parentElement.tagName.toLowerCase() === 'a') {
      if (newGame) { newGame = null; } // Clearing after passing game
      changeCard(event.target.parentElement);
    }

    burgerBtn.classList.remove('burger-menu__btn_active');
    navigation.classList.remove('burger-menu__navigation_active');
  });

  checkBoxLabel.addEventListener('click', () => {
    mainPage.classList.toggle('play-mode');
    categoryPage.classList.toggle('play-mode');
    starContainer.classList.toggle('play-mode');
    document.querySelector('.container').classList.toggle('play-mode');
    gameDestroyer(newGame); // Destroy game if you clicked on switch-btn during the game
  });
});
