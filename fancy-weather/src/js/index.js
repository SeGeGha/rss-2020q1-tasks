import weatherApplication from './weather.app';
import eventsCreator from './functionHelpers/events.creator';
import { recognizer, speaker } from './functionHelpers/speech.manager';

document.addEventListener('DOMContentLoaded', () => {
  const isNotSupportSpeechRecognition = recognizer.recognition.error;
  const isNotSupportSpeechSynthesis = speaker.message.error;

  if (isNotSupportSpeechRecognition) {
    document.querySelector('.search__speech-recognition').classList.add('hidden');
  }

  if (isNotSupportSpeechSynthesis) {
    document.querySelector('.control-block > .btn-wrapper').classList.add('hidden');
  }

  eventsCreator();
  weatherApplication.init();
});
