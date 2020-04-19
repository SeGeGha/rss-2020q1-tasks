import { cardsNamesDirectory, imagePreloader, soundPreloader } from './preloaders';
import statistics from './statistics';

class Page {
  constructor(categoryCards) {
    this.page = [...categoryCards];
    this.cards = [];
  }

  init(categoryName) {
    cardsNamesDirectory[categoryName].forEach((word, index) => {
      this.cards.push({
        name: word[0], // 0 - english name
        translate: word[1], // 1 - translate
        imgSrc: imagePreloader[categoryName][index].src,
        sound() {
          soundPreloader[categoryName][index].play();
        },
      });
    });
  }

  connectPage() {
    this.page.forEach((card, index) => {
      const image = card.querySelector('img');
      const captions = card.querySelectorAll('.card__title');
      const currentCard = this.cards[index];

      image.src = currentCard.imgSrc;

      captions.forEach((item, id) => {
        const p = item;
        p.textContent = (id === 0) ? currentCard.name : currentCard.translate;
      });
    });
  }

  getSound(card) {
    const clickedCardId = this.page.findIndex((item) => item === card);
    const clickedCard = this.cards[clickedCardId];
    clickedCard.sound();
    statistics.counter(clickedCard.name);
  }
}

export default Page;
