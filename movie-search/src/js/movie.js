import keyApiDirectory from './keyApi.directory';

function movieComponent(query, pageCount = 1) {
  const searchResult = document.querySelector('.search__result');
  const apiKey = keyApiDirectory.omdb;
  const url = `https://www.omdbapi.com/?s=${query}&page=${pageCount}&apikey=${apiKey}`;

  function createCards(movieStorage) {
    const movieCardStorage = [];

    movieStorage.forEach((movie) => {
      movieCardStorage.push(`<div class="card slide_active">
      <a href="${movie.link}" class="card__header" target="_blank">${movie.title}</a>
      <div class="card__body" style="background-image: url(${movie.poster});"></div>
      <div class="card__footer">${movie.year}</div>
      <div class="card__imbd">
        <span class="star">&#9733;</span>${movie.imdbRated}
      </div>
    </div>`);
    });
  }

  async function handlerData(moviesArr) {
    const movieStorage = [];

    searchResult.textContent = (!moviesArr) ? `No results for your query - ${query}` : '';

    for (let i = 0; i < moviesArr.length; i += 1) {
      const movie = moviesArr[i];
      const { Title: title, Year: year, imdbID } = movie;
      const poster = (movie.Poster === 'N/Y') ? '' : movie.Poster;
      const link = `https://www.imdb.com/title/${imdbID}/videogallery`;
      const urlImdbRating = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

      movieStorage.push((async function c() {
        return fetch(urlImdbRating)
          .then((result) => result.json())
          .then((movieObj) => ({
            title,
            link,
            poster,
            year,
            imdbRated: movieObj.imdbRating,
          }))
          .catch(() => ({
            title,
            link,
            poster,
            year,
            imdbRated: 'N/A',
          }));
      }()));
    }

    createCards(await Promise.all(movieStorage));
  }

  async function receiveData() {
    try {
      const queryResult = await fetch(url);
      const pageResult = await queryResult.json();
      const moviesArr = pageResult.Search;

      handlerData(moviesArr);
    } catch (error) {
      searchResult.textContent = 'Data could not be loaded, please try again later';
    }
  }

  receiveData();
}

export { movieComponent, keyApiDirectory };
