import keyDirectory from '../js/directory/keyDirectory';
import swiperManager from '../js/swiper';

const keyDirectoryFunctions = {
  getLength: () => Object.keys(keyDirectory).length,
  getEnglishKeyName: (key) => keyDirectory[key].engKeyName.standardKeyName,
  getKeyNameValues: (key) => {
    if (keyDirectory[key].getValue) {
      return Object.keys(keyDirectory[key].rusKeyName).length === 2;
    }
    return false;
  },
};

const swiperFunctions = {
  getLength: () => Object.keys(swiperManager).length,
  checkPreviousQueryName: (data) => {
    const swiper = jest.createMockFromModule('../js/swiper.js').default;
    swiper.handlerObtainData(data);
    return swiper.totalPageNumber;
  },
};

export { 
  keyDirectory, keyDirectoryFunctions, swiperManager, swiperFunctions,
};
