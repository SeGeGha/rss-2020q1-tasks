import swiperManager from '../swiper/main';

function createCards(movieStorage, programObj) {
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

  swiperManager.handlerObtainData(data);
}

export default createCards;
