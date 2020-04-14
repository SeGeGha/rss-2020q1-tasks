import changePage from './changerPage.js';

class Game {
  constructor(pageCards, ...elements) {
    this.arrPage = pageCards;
    this.controlElements = [...elements];
    this.cards = [];
    this.currentCard = null;
    this.soundEffect = null;
    this.error = 0;
  }

  makeGameCards() {
    this.arrPage.cards.forEach((card, index) => {
      this.cards.push({
        name: card.name,
        id: index,
        sound: card.sound,
        error: 0,
        success: 0,
      });
    });
    this.shuffleCards();
  }

  shuffleCards() {
    let currentIndex = this.cards.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  getCurrentCard() {
    [this.currentCard] = this.cards;
    this.currentCard.sound();
  }

  getSoundGame(type) {
    this.soundEffect = new Audio();
    this.soundEffect.src = `./audio/${type}.mp3`;
    this.soundEffect.play();
  }

  startGame() {
    this.makeGameCards();
    this.getCurrentCard();
  }

  checkCard(card) {
    // Find card index from page
    const cardIndex = this.arrPage.page.findIndex((currentCard) => currentCard === card);

    function validation(condition) {
      if (condition) { // If card is correct
        this.getSoundGame('correct');
        this.arrPage.page[cardIndex].classList.add('darken');
        this.controlElements[0].innerHTML += '&#9733;'; // Add "correct-star" to star-container
        this.cards.splice(0, 1); // Delete a guessed card from array

        // Continue or finish the current game
        setTimeout(() => {
          if (this.cards.length !== 0) {
            this.getCurrentCard();
          } else {
            this.finishGame();
          }
        }, 1000);
      } else { // If card is wrong
        this.getSoundGame('error');
        this.error += 1;
        this.controlElements[0].innerHTML += '&#9734'; // Add "wrong-star" to star-container
      }
    }
    // Check cardIndex in cards array
    if (this.cards.some((currentCard) => currentCard.id === cardIndex)) {
      validation.call(this, this.currentCard.id === cardIndex);
    }
  }

  finishGame() {
    this.controlElements[1].classList.add('show'); // Display screen with a game result
    if (this.error === 0) {
      this.controlElements[1].textContent = 'Win!';
      this.getSoundGame('success');
    } else {
      this.controlElements[1].textContent = `${this.error} error`;
      this.getSoundGame('failure');
    }

    setTimeout(() => this.controlElements[1].classList.remove('show'), 3000);
    changePage('main', 'main'); // Back to main page
    this.clearPage(); // Return everything to its original state
  }

  clearPage() {
    // Return "Start game" button
    this.controlElements[2].classList.remove('repeat');
    this.controlElements[2].innerHTML = 'Start game';
    // Clean star-container
    this.controlElements[0].innerHTML = '';
    // Remove cards darkening
    this.arrPage.page.forEach((card) => card.classList.remove('darken'));
  }
}

export default Game;
