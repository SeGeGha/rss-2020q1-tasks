async function uploadMoviesPoster(posters) {
  const imageStub = './assets/img/no-poster.jpg';

  const uploadedPosters = [];

  const promises = posters.map((poster) => new Promise((resolve) => {
    const image = new Image();
    image.src = (poster !== 'N/A') ? poster : imageStub;
    image.onload = (event) => {
      uploadedPosters.push(event.target.src);
      resolve();
    };
    image.onerror = () => {
      uploadedPosters.push(imageStub);
      resolve();
    };
  }));

  await Promise.all(promises);

  return uploadedPosters;
}

export default uploadMoviesPoster;
