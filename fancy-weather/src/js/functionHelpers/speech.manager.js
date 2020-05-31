import weatherApplication from '../weather.app';
import valuesDirectory from '../directories/values.directory';
import sendRequest from '../requestSenders/forecast.requestSender';

const speechObj = {
  standard: window.SpeechRecognition,
  webkit: window.webkitSpeechRecognition,
  moz: window.mozSpeechRecognition,
};

const SpeechRecognition = speechObj.standard || speechObj.webkit || speechObj.moz;

const recognizer = {
  textInput: document.querySelector('.search__input'),
  speechBtn: document.querySelector('.search__speech-recognition'),
  recognition: new SpeechRecognition(),
  isRecognizing: false,

  start() {
    this.isRecognizing = true;
    this.speechBtn.classList.add('active');
    this.recognition.start();

    this.recognition.onresult = (event) => {
      this.textInput.value += event.results[0][0].transcript;
      this.stop();
    };
  },

  stop() {
    const { getPlace } = valuesDirectory.requestType;
    const query = document.querySelector('.search__input').value;

    this.deactivate();

    document.querySelector('#cube-loader').classList.add('active');
    document.querySelector('.error').textContent = '';

    sendRequest(query, weatherApplication.programSettings, getPlace)
      .then((response) => weatherApplication.dataHandler(response));
  },
  deactivate() {
    this.isRecognizing = false;
    this.speechBtn.classList.remove('active');
    this.recognition.stop();
  },
};

export default recognizer;