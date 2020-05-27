import weatherApplication from './weather.app';
import sendRequest from './forecast.requestSender';
import valuesDirectory from './values.directory';

function handleClicksControlBlock(clickTarget) {
  const { value: newParameterValue } = clickTarget.dataset;
  const { language, unit: tempUnit } = valuesDirectory;
  let OldParameterValue;
  let handlerFunctionName;

  switch (newParameterValue) {
    case tempUnit.celsius:
    case tempUnit.fahrenheit:
      OldParameterValue = weatherApplication.programSettings.appTemperatureUnit;
      break;
    default:
      break;
  }
}
//TODO: CONTROL BLOCK HANDLER CHANGE
function eventsCreator() {
  document.querySelector('.control-block').addEventListener('click', (event) => {
    const { target } = event;
    const { appTemperatureUnit, appLanguage } = weatherApplication.programSettings;

    switch (target.dataset.value) {
      case '°F':
      case '°C':
        if (appTemperatureUnit !== target.dataset.value) {
          document.querySelector(`[data-value="${appTemperatureUnit}"]`).classList.remove('active');
          target.classList.add('active');

          weatherApplication.changerTempUnit(target.dataset.value);
        }
        break;
      case 'en':
      case 'ru':
      case 'be':
        if (appLanguage !== target.dataset.value) {
          document.querySelector(`[data-value="${appLanguage}"]`).classList.remove('active');
          target.classList.add('active');

          weatherApplication.translator(target.dataset.value);
        }
        break;
      default:
        break;
    }
  });

  document.querySelector('.search__button').addEventListener('click', (event) => {
    event.preventDefault();

    const { getPlace } = valuesDirectory.requestType;
    const query = document.querySelector('.search__input').value;

    sendRequest(query, weatherApplication.programSettings, getPlace)
      .then((response) => weatherApplication.dataHandler(response));
  });
}
export default eventsCreator;
