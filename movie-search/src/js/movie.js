import keyApiDirectory from './keyApi.directory';
import swiperManager from './swiper';
import { searchResult, searchLoader } from './globalVariables.directory';

function movieComponent(query, pageCount = 1) {
  const apiKey = keyApiDirectory.omdb;
  const url = `https://www.omdbapi.com/?s=${query}&page=${pageCount}&apikey=${apiKey}`;

  function createCards(movieStorage) {
    const movieCardStorage = [];

    movieStorage.forEach((movie) => {
      movieCardStorage.push(`<div class="swiper-slide card swiper-slide-next">
        <div class="card__header">
          <a href="${movie.link}" target="_blank">${movie.title}</a>
        </div>
        <div class="card__body">
          <div class="poster" style="background-image: url(${movie.poster})"></div>
        </div>
        <div class="card__footer">
          <div class="year">${movie.year}</div>
          <div class="imbd-rating">
            <span class="star">&#9733;</span>${movie.imdbRating}</div>
        </div>
      </div>`);
    });

    const data = {
      movieCardStorage,
      pageNumber: pageCount,
      queryName: query,
    };

    swiperManager.handlerObtainData(data);
  }

  async function handlerData(moviesArr) {
    const movieStorage = [];
    const hasResult = Boolean(moviesArr);
    const isFirstPage = pageCount === 1;

    if (!hasResult && isFirstPage) {
      searchResult.textContent = `No results were found for '${query}'`;
      searchLoader.classList.remove('active');
    }

    if (hasResult) {
      for (let i = 0; i < moviesArr.length; i += 1) {
        const movie = moviesArr[i];
        const { Title: title, Year: year, imdbID } = movie;
        const link = `https://www.imdb.com/title/${imdbID}/videogallery`;
        const urlImdbRating = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

        const image = new Image();

        image.src = (movie.Poster !== 'N/A') ? movie.Poster : './assets/img/no-poster.jpg';

        movieStorage.push((async function getFullInfo() {
          return fetch(urlImdbRating)
            .then((result) => result.json())
            .then((movieObj) => ({
              title,
              link,
              poster: image.src,
              year,
              imdbRating: movieObj.imdbRating,
            }))
            .catch(() => ({
              title,
              link,
              poster: image.src,
              year,
              imdbRating: 'N/A',
            }));
        }()));
      }

      createCards(await Promise.all(movieStorage));
    }
  }

  async function receiveData() {
    try {
      const queryResult = await fetch(url);
      const pageResult = await queryResult.json();
      const moviesArr = pageResult.Search;

      handlerData(moviesArr);
    } catch (error) {
      searchResult.textContent = `No results were found for '${query}'`;
      searchLoader.classList.remove('active');
    }
  }

  receiveData();
}

export { movieComponent, keyApiDirectory };
