import { requestType } from '../configs/appSettings';
import weatherApplication from '../weather.app';
import sendRequest from '../requestSenders/forecast';
import { recognizer, speaker } from './speech.manager';

function eventsCreator() {
  const errorBlock = document.querySelector('.error');

  document.querySelector('.control-block').addEventListener('click', ({ target }) => {
    const { appTemperatureUnit, appLanguage } = weatherApplication.programSettings;
    const targetValue = target.dataset.value

    errorBlock.textContent = '';

    switch (targetValue) {
      case '°F':
      case '°C':
        if (appTemperatureUnit !== targetValue) {
          document.querySelector(`[data-value="${appTemperatureUnit}"]`).classList.remove('active');
          target.classList.add('active');

          weatherApplication.changerTempUnit(targetValue);
        }
        break;
      case 'en':
      case 'ru':
      case 'be':
        if (appLanguage !== targetValue) {
          document.querySelector(`[data-value="${appLanguage}"]`).classList.remove('active');
          target.classList.add('active');

          weatherApplication.translator(targetValue);
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

    const { getPlace } = requestType;
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
