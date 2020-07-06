import { searchInput } from '../directory/globalVariables';

const speechObj = {
  standard: window.SpeechRecognition,
  webkit: window.webkitSpeechRecognition,
  moz: window.mozSpeechRecognition,
  ms: window.msSpeechRecognition,
};

const SpeechRecognition = speechObj.standard || speechObj.webkit || speechObj.moz || speechObj.ms;

class Recognizer {
  constructor() {
    this.recognition = (function init() {
      let newRecognition;

      try {
        newRecognition = new SpeechRecognition();
      } catch (error) {
        newRecognition = {
          error: 'Your browser doesn\'t support Speech Recognition',
        };
      }

      return newRecognition;
    }());
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.isRecognizing = false;
    this.textInput = null;
  }

  start() {
    this.textInput = searchInput;
    this.recognition.onresult = (event) => {
      this.onResult(event);
    };
    this.recognition.start();
    this.isRecognizing = true;
  }

  stop() {
    this.recognition.abort();
    this.isRecognizing = false;
  }

  onResult(event) {
    const transcript = Array.from(event.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join('');

    this.textInput.value = transcript;
  }
}

export default Recognizer;
