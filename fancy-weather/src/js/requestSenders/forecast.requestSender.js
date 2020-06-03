import apiDirectory from '../directories/apiInfo.directory';
import valuesDirectory from '../directories/values.directory';
import translationDirectory from '../directories/translate.directory';

function sendRequest(locationInfo, settings, requestType) {
  const { getPlace } = valuesDirectory.requestType;
  const apiService = (requestType === getPlace) ? apiDirectory.openCageData : apiDirectory.openWeatherMap;

  return fetch(apiService.getRequestUrl(locationInfo, settings))
    .then((response) => response.json())
    .then((content) => ({
      type: requestType,
      content,
    }))
    .catch(() => ({
      type: valuesDirectory.requestError,
      message: translationDirectory.error.failedRequest[settings.appLanguage],
    }));
}

export default sendRequest;
