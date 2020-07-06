function receiveMovieRating(moviesId, key) {
  const ratings = moviesId.map((imdbID) => {
    const urlImdbRating = `https://www.omdbapi.com/?i=${imdbID}&apikey=${key}`;

    return fetch(urlImdbRating)
      .then((result) => result.json())
      .then((movieObj) => movieObj.imdbRating)
      .catch(() => 'N/A');
  });

  return Promise.all(ratings);
}

export default receiveMovieRating;
