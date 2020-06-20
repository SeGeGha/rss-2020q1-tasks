import weatherApplication from '../weather.app';
import sendRequest from '../requestSenders/forecast.requestSender';
import valuesDirectory from '../directories/values.directory';
import { recognizer, speaker } from './speech.manager';

function eventsCreator() {
  const errorBlock = document.querySelector('.error');

  document.querySelector('.control-block').addEventListener('click', (event) => {
    const { target } = event;
    const { appTemperatureUnit, appLanguage } = weatherApplication.programSettings;

    errorBlock.textContent = '';

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

    document.querySelector('#cube-loader').classList.add('active');
    errorBlock.textContent = '';

    const { getPlace } = valuesDirectory.requestType;
    const query = document.querySelector('.search__input').value;

    sendRequest(query, weatherApplication.programSettings, getPlace)
      .then((response) => weatherApplication.dataHandler(response));
  });

  document.querySelector('.control__update').addEventListener('click', () => {
    errorBlock.textContent = '';
    weatherApplication.backgroundImgChanger();
  });

  document.querySelector('.search__speech-recognition').addEventListener('click', () => {
    if (!recognizer.isRecognizing) {
      recognizer.start();
    } else {
      recognizer.deactivate();
    }
  });

  document.querySelector('.control__speak').addEventListener('click', (event) => {
    event.target.classList.toggle('active');

    if (!speaker.isSpeaking) {
      speaker.start();
    }
  });

  document.querySelector('.btn-wrapper > div').addEventListener('click', (event) => {
    if (event.target.classList.contains('volume_up')) {
      speaker.regulateVolume('up');
    } else {
      speaker.regulateVolume('down');
    }
  });
}
export default eventsCreator;