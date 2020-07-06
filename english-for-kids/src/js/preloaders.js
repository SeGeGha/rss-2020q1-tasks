import cardsNamesDirectory from './cardsDirectory';

const imagePreloader = [];
const soundPreloader = [];

function preLoader(type) {
  Object.keys(cardsNamesDirectory).forEach((category) => {
    const categoryArr = [];

    cardsNamesDirectory[category].forEach((word) => { // word[0] - english name; word[1] - translate
      const variable = (type === 'image') ? new Image() : new Audio();
      variable.src = (type === 'image') ? `./assets/img/${word[0]}.jpg` : `./assets/audio/${word[0]}.mp3`;
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
