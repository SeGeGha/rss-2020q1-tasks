async function receiveMovieRating(moviesId, key) {
  const ratings = [];

  const promises = moviesId.map((imdbID) => {
    const urlImdbRating = `https://www.omdbapi.com/?i=${imdbID}&apikey=${key}`;

    return fetch(urlImdbRating)
      .then((result) => result.json())
      .then((movieObj) => ratings.push(movieObj.imdbRating))
      .catch(() => ratings.push('N/A'));
  });

  await Promise.all(promises);

  return ratings;
}

export default receiveMovieRating;
