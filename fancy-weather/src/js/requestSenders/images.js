import { requestType } from '../configs/appSettings';
import { flickr } from '../directories/apiInfo';
import { imageStubs } from '../directories/values';

function getBackgroundImages(keywords) {
  const tags = Object.values(keywords).join(',');

  return fetch(flickr.getRequestUrl(tags))
    .then((response) => response.json())
    .then((data) => ({
      type: requestType.getImages,
      content: (data.stat === 'ok') ? data : imageStubs,
    }))
    .catch(() => ({
      type: requestType.getImages,
      content: imageStubs,
    }));
}

export default getBackgroundImages;
