import { cardsNamesDirectory, imagePreloader, soundPreloader } from './preloaders.js';

class Page {
  constructor(categoryPage) {
    this.page = [...categoryPage];
    this.cards = [];
  }

  init(categoryName) {
    cardsNamesDirectory[categoryName].forEach((card, index) => {
      this.cards.push({
        name: card[0], // 0 - english name
        translate: card[1], // 1 - russian name
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

      image.src = this.cards[index].imgSrc;

      captions.forEach((item, id) => {
        const p = item;
        p.textContent = (id === 0) ? this.cards[index].name : this.cards[index].translate;
      });
    });
  }

  getSound(card) {
    const index = this.page.findIndex((item) => item === card);
    this.cards[index].sound();
  }
}

export default Page;
