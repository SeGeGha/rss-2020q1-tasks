import keyDirectory from '../js/directory/keyDirectory';
import uploadMoviesPoster from '../js/movie/moviesCardCreator';

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

const cardCreatorFunctions = {
  checkResult: (movieStorage, programObj) => {
    const movieCardStorage = [];
    const { page, query } = programObj;
  
    movieStorage.forEach((movie) => {
      movieCardStorage.push(`<div class="swiper-slide card swiper-slide-next">
        <div class="card__header">
          <a href="${movie.link}" target="_blank">${movie.title}</a>
        </div>
        <div class="card__body" style="background-image: url(${movie.poster})"></div>
        <div class="card__footer">
          <div class="year">${movie.year}</div>
          <div class="imbd-rating">
            <span class="star">&#9733;</span>${movie.imdbRating}</div>
        </div>
      </div>`);
    });
  
    const data = {
      movieCardStorage,
      pageNumber: page,
      query,
    };
  
    return data;
  }
};

export { keyDirectory, keyDirectoryFunctions, cardCreatorFunctions };
