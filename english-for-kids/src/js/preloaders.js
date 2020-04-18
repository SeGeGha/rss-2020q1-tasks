import cardsNamesDirectory from './cardsDirectory.js';

const imagePreloader = [];
const soundPreloader = [];

function preLoader(type) {
  Object.keys(cardsNamesDirectory).forEach((category) => {
    const categoryArr = [];
    cardsNamesDirectory[category].forEach((card) => {
      const variable = (type === 'image') ? new Image() : new Audio();
      variable.src = (type === 'image') ? `./image/${card[0]}.jpg` : `./audio/${card[0]}.mp3`;
      categoryArr.push(variable);
    });

    if (type === 'image') {
      imagePreloader[category] = categoryArr;
    } else {
      soundPreloader[category] = categoryArr;
    }
  });
}

preLoader('image');
preLoader('sound');

export { cardsNamesDirectory, imagePreloader, soundPreloader };
