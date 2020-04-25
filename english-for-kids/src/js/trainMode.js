import { cardsNamesDirectory as directory, imagePreloader, soundPreloader } from './preloaders';
import statistics from './statistics';

class Page {
  constructor(categoryCards) {
    this.page = [...categoryCards];
    this.cards = [];
  }

  init(categoryName, objDifWords) {
    // Check sender of the request:
    // (!objDifWords) - links on pages
    // (objDifWords) - btn repeat words on statistics page
    const data = (!objDifWords) ? directory[categoryName] : objDifWords['difficult words'];

    data.forEach((word, index) => {
      // Word index: 0 - english name; 1 - translate; 2 (for objDifWords) - word category
      const id = (objDifWords) ? directory[word[2]].findIndex((item) => item[0] === word[0]) : null;

      const category = (!objDifWords) ? categoryName : word[2];
      const indexWord = (!objDifWords) ? index : id;
      this.cards.push({
        name: word[0],
        translate: word[1],
        imgSrc: imagePreloader[category][indexWord].src,
        sound() {
          soundPreloader[category][indexWord].play();
        },
      });
    });
  }

  connectPage() {
    if (this.cards.length === 0) {
      document.querySelector('.category-page').classList.add('hidden');
    } else {
      document.querySelector('.category-page').classList.remove('hidden');

      this.page.forEach((card, index) => {
        const image = card.querySelector('img');
        const captions = card.querySelectorAll('.card__title');
        const currentCard = this.cards[index];

        if (currentCard) {
          card.closest('.card-wrapper').classList.remove('hidden');

          image.src = currentCard.imgSrc;
          image.alt = `Image of ${currentCard.name}`;

          captions.forEach((item, id) => {
            const p = item;
            p.textContent = (id === 0) ? currentCard.name : currentCard.translate;
          });
        } else {
          card.closest('.card-wrapper').classList.add('hidden');
        }
      });
    }
  }

  getSound(card) {
    const clickedCardId = this.page.findIndex((item) => item === card);
    const clickedCard = this.cards[clickedCardId];
    clickedCard.sound();
    statistics.counter(clickedCard.name);
  }
}

export default Page;
