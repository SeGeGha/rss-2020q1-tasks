import apiDirectory from '../directories/apiInfo.directory';
import valuesDirectory from '../directories/values.directory';

function getBackgroundImages(keywords) {
  const { flickr } = apiDirectory;
  const tags = Object.values(keywords).join(',');

  return fetch(flickr.getRequestUrl(tags))
    .then((response) => response.json())
    .then((data) => ({
      type: valuesDirectory.requestType.getImages,
      content: data,
    }))
    .catch(() => ({
      type: valuesDirectory.requestType.getImages,
      content: valuesDirectory.imageStubs,
    }));
}

export default getBackgroundImages;
