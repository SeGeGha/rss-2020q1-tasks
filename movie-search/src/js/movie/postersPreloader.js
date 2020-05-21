function uploadMoviesPoster(posters) {
  const imageStub = './assets/img/no-poster.jpg';

  const uploadedPosters = posters.map((poster) => new Promise((resolve) => {
    const image = new Image();
    image.src = (poster !== 'N/A') ? poster : imageStub;
    image.onload = (event) => {
      resolve(event.target.src);
    };
    image.onerror = () => {
      resolve(imageStub);
    };
  }));

  return Promise.all(uploadedPosters);
}

export default uploadMoviesPoster;
