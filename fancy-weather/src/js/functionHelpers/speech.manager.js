import weatherApplication from '../weather.app';
import valuesDirectory from '../directories/values.directory';
import sendRequest from '../requestSenders/forecast.requestSender';
import translationDirectory from '../directories/translate.directory';

const speechObj = {
  standard: window.SpeechRecognition,
  webkit: window.webkitSpeechRecognition,
  moz: window.mozSpeechRecognition,
};
const SpeechRecognition = speechObj.standard || speechObj.webkit || speechObj.moz;

const speaker = {
  speakBtn: document.querySelector('.control__speak'),
  synthesis: window.speechSynthesis,
  message: new SpeechSynthesisUtterance(),
  isSpeaking: false,

  init(appLanguage, weatherMessage) {
    const synthesisLang = {
      en: 'en-US',
      ru: 'ru-RU',
      be: 'ru-RU',
    };

    this.message.text = weatherMessage;
    this.message.lang = synthesisLang[appLanguage];
    this.message.volume = 0.6;
  },

  start() {
    this.speakBtn.classList.add('active');
    this.isSpeaking = true;
    this.synthesis.speak(this.message);

    const speakingId = setInterval(() => {
      if (!this.synthesis.speaking) {
        this.isSpeaking = false;
        this.speakBtn.classList.remove('active');
        clearInterval(speakingId);
      }
    }, 1000);
  },

  regulateVolume(direction) {
    if (direction === 'up') {
      const isMaxVolume = this.message.volume === 1;
      this.message.volume += (isMaxVolume) ? 0 : 0.2;
    } else {
      const isMinVolume = !this.message.volume;
      this.message.volume -= (isMinVolume) ? 0 : 0.2;
    }
  },
};

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
      this.checkResult(event.results[0][0].transcript);
    };
  },

  checkResult(result) {
    const checkwords = [
      translationDirectory.forecast,
      translationDirectory.quieter,
      translationDirectory.louder,
    ];
    const findSpokenCheckwordId = checkwords.findIndex((word) => Object.values(word).find((value) => value === result));

    switch (findSpokenCheckwordId) {
      case 0:
        speaker.start();
        this.deactivate();
        break;
      case 1:
      case 2:
        speaker.regulateVolume((findSpokenCheckwordId === 2) ? 'up' : 'down');
        this.deactivate();
        break;
      default:
        this.textInput.value = result;
        this.stop();
        break;
    }
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

export { recognizer, speaker };
