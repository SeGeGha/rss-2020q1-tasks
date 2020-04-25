import changePage from './changerPage';
import statistics from './statistics';

class Game {
  constructor(pageCards, ...elements) {
    this.arrPage = pageCards;
    this.controlElements = [...elements];
    this.gameCards = [];
    this.currentCard = null;
    this.soundEffect = null;
    this.error = 0;
  }

  makeGameCards() {
    this.arrPage.cards.forEach((card, index) => {
      this.gameCards.push({
        name: card.name,
        id: index,
        sound: card.sound,
      });
    });
    this.shuffleCards();
  }

  shuffleCards() {
    for (let currentIndex = this.gameCards.length; currentIndex > 0;) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      const temporaryValue = this.gameCards[currentIndex];

      this.gameCards[currentIndex] = this.gameCards[randomIndex];
      this.gameCards[randomIndex] = temporaryValue;
    }
  }

  getCurrentCard() {
    [this.currentCard] = this.gameCards; // Current game card - 1 card in array
    this.currentCard.sound();
  }

  getSoundGame(type) {
    this.soundEffect = new Audio();
    this.soundEffect.src = `./assets/audio/${type}.mp3`;
    this.soundEffect.play();
  }

  startGame() {
    this.makeGameCards();
    this.getCurrentCard();
  }

  checkCard(card) {
    // Find card index from page
    const cardIndex = this.arrPage.page.findIndex((item) => item === card);

    // Check cardIndex in cards array
    if (this.gameCards.some((currentCard) => currentCard.id === cardIndex)) {
      const condition = this.currentCard.id === cardIndex; // card is correct?
      this.validation(condition, cardIndex);
      statistics.counter(this.currentCard.name, true, condition);
    }
  }

  validation(condition, cardIndex) {
    const correctCard = this.arrPage.page[cardIndex]; // Find correct card on page
    const [starContainer] = this.controlElements;

    if (condition) { // If card is correct
      correctCard.classList.add('darken');
      this.getSoundGame('correct');
      starContainer.innerHTML += '&#9733;'; // Add "correct-star" to star-container
      this.gameCards.splice(0, 1); // Delete a guessed card from array

      // Continue or finish a current game
      setTimeout(() => {
        if (this.gameCards.length !== 0) {
          this.getCurrentCard();
        } else {
          this.finishGame();
        }
      }, 1000);
    } else { // If card is wrong
      this.getSoundGame('error');
      this.error += 1;
      starContainer.innerHTML += '&#9734'; // Add "wrong-star" to star-container
    }
  }

  finishGame() {
    const result = (this.error === 0) ? 'success' : 'failure';
    const [, resultBox] = this.controlElements;
    const caption = resultBox.firstElementChild; // <p class='result__caption'>

    caption.textContent = (result !== 'success') ? `${this.error} error` : 'Win!';

    resultBox.classList.add(result);
    this.getSoundGame(result);

    setTimeout(() => {
      resultBox.classList.remove('success', 'failure');
      caption.textContent = '';
    }, 3000);

    changePage('main', 'main'); // Back to main page
    this.clearPage(); // Return everything to its original state
  }

  clearPage() {
    const [starContainer, , gameBtn] = this.controlElements;
    // Return "Start game" button
    gameBtn.classList.remove('repeat');
    gameBtn.innerHTML = 'Start game';
    // Clean star-container
    starContainer.innerHTML = '';
    // Remove cards darkening
    this.arrPage.page.forEach((card) => card.classList.remove('darken'));
  }
}

export { Game, statistics };
