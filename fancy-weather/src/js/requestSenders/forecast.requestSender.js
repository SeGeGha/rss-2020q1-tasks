import apiDirectory from '../directories/apiInfo.directory';
import valuesDirectory from '../directories/values.directory';

function sendRequest(locationInfo, settings, requestType) {
  const { openCageData, openWeatherMap } = apiDirectory;
  const { getPlace } = valuesDirectory.requestType;
  const apiService = (requestType === getPlace) ? openCageData : openWeatherMap;

  return fetch(apiService.getRequestUrl(locationInfo, settings))
    .then((response) => response.json())
    .then((content) => ({
      type: requestType,
      content,
    }))
    .catch((error) => ({
      type: `${valuesDirectory.requestError}: ${error}`,
    }));
}

export default sendRequest;
