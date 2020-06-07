import { movieComponent } from '../movie/main';
import { searchResult, searchInput, searchLoader } from '../directory/globalVariables';
import { keyboard } from '../virtualKeyboard/main';
import Recognizer from './speechRecognition';
import handlerInputValue from './inputValueHandler';

const searchButton = document.querySelector('.search__submit');
const searchInputReset = document.querySelector('.field__clean');
const searchKeyboardBtn = document.querySelector('.field__keyboard-btn');
const speechBtn = document.querySelector('.field__speech-recognition ');
const recognizer = new Recognizer();

function searchComponent() {
  searchKeyboardBtn.addEventListener('click', () => {
    searchInput.focus();
    keyboard.main.classList.toggle('active');
  });

  searchButton.addEventListener('click', (event) => {
    event.preventDefault();

    searchLoader.classList.add('active');

    speechBtn.classList.remove('active');

    if (recognizer.isRecognizing) {
      recognizer.stop();
    }

    handlerInputValue();
  });

  searchInputReset.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
  });

  speechBtn.addEventListener('click', (event) => {
    const isSupportSpeech = recognizer.recognition.error;

    if (!isSupportSpeech) {
      event.target.classList.toggle('active');

      if (!recognizer.isRecognizing) {
        recognizer.start();
      } else {
        recognizer.stop();
      }
    } else {
      searchResult.textContent = isSupportSpeech;
    }

    searchInput.focus();
  });
}


export { movieComponent, searchComponent, handlerInputValue };
