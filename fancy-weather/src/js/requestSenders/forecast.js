import { requestType } from '../configs/appSettings';
import { openWeatherMap, openCageData } from '../directories/apiInfo';
import { requestError } from '../directories/values';
import translationDirectory from '../directories/translate';

function sendRequest(locationInfo, settings, appRequestType) {
  const apiService = (appRequestType === requestType.getPlace) ? openCageData : openWeatherMap;

  return fetch(apiService.getRequestUrl(locationInfo, settings))
    .then((response) => response.json())
    .then((content) => ({
      type: appRequestType,
      content,
    }))
    .catch(() => ({
      type: requestError,
      message: translationDirectory.error.failedRequest[settings.appLanguage],
    }));
}

export default sendRequest;
