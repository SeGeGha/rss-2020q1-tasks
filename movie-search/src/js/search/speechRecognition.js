import { searchInput } from '../directory/globalVariables';

const speechObj = {
  standard: window.SpeechRecognition,
  webkit: window.webkitSpeechRecognition,
  moz: window.mozSpeechRecognition,
};

const SpeechRecognition = speechObj.standard || speechObj.webkit || speechObj.moz;

class Recognizer {
  constructor() {
    this.recognition = new SpeechRecognition();
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
