import { searchResult, searchLoader } from '../directory/globalVariables';
import receiveMovieRating from './ratingRequestSender';
import uploadMoviesPoster from './postersPreloader';
import createCards from './moviesCardCreator';

async function handlerData(moviesArr, programObj) {
  const hasResult = Boolean(moviesArr);
  const { query, page, key } = programObj;
  const isFirstPage = page === 1;

  if (!hasResult && isFirstPage) {
    searchResult.textContent = `No results were found for '${query}'`;
    searchLoader.classList.remove('active');
  }

  if (hasResult) {
    const moviesId = moviesArr.map((movie) => movie.imdbID);

    const moviesRating = await receiveMovieRating(moviesId, key);

    const moviesPosterLinks = moviesArr.map((movie) => movie.Poster);

    const moviesUploadedPosters = await uploadMoviesPoster(moviesPosterLinks);

    const movieStorage = moviesArr.map((movie, index) => {
      const { Title: title, Year: year, imdbID } = movie;
      const link = `https://www.imdb.com/title/${imdbID}/videogallery`;
      return {
        title,
        link,
        poster: moviesUploadedPosters[index],
        year,
        imdbRating: moviesRating[index],
      };
    });

    createCards(movieStorage, programObj);
  }
}

export default handlerData;
