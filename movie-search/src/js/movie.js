import keyApiDirectory from './keyApi.directory';
import swiperManager from './swiper';
import { searchResult, searchLoader } from './globalVariables.directory';

function movieComponent(query, pageCount = 1) {
  const apiKey = keyApiDirectory.omdb;
  const url = `https://www.omdbapi.com/?s=${query}&page=${pageCount}&apikey=${apiKey}`;

  function createCards(movieStorage) {
    const movieCardStorage = [];

    movieStorage.forEach((movie) => {
      const card = document.createElement('div');
      const cardHeader = document.createElement('div');
      const cardBody = document.createElement('div');
      const cardFooter = document.createElement('div');
      const cardImbd = document.createElement('div');

      cardHeader.className = 'card__header';
      cardBody.className = 'card__body';
      cardFooter.className = 'card__footer';
      cardImbd.className = 'card__imbd';
      card.className = 'swiper-slide card';

      cardHeader.insertAdjacentHTML('afterbegin', `<a href='${movie.link}' target='_blank'>${movie.title}</a>`);
      cardImbd.insertAdjacentHTML('afterbegin', `<span class='star'>&#9733;</span>${movie.imdbRating}`);

      cardBody.style.backgroundImage = `url(${movie.poster})`;

      cardFooter.textContent = movie.year;

      card.append(cardHeader, cardBody, cardFooter, cardImbd);

      movieCardStorage.push(card);
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


        // TODO: handling image + rating
        const image = new Image();
        image.src = (movie.Poster !== 'N/A') ? movie.Poster : './assets/img/no-poster.jpg';

        image.onerror = function handlerDownloadError() {
          image.src = './assets/img/no-poster.jpg';
        };

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
