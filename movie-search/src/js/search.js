import { movieComponent, keyApiDirectory } from './movie';
import { searchInput, searchResult, searchLoader } from './directory/globalVariables';
import { keyboard } from './keyboard';

const searchButton = document.querySelector('.search__submit');
const searchInputReset = document.querySelector('.field__clean');
const searchKeyboardBtn = document.querySelector('.keyboard-btn');

async function handlerQuery(query) {
  const key = keyApiDirectory.yandex;
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${query}&lang=ru-en`;

  try {
    const queryResult = await fetch(url);
    const translationResult = await queryResult.json();
    const [translation] = translationResult.text;

    return translation;
  } catch (error) {
    searchLoader.classList.remove('active');
    searchResult.textContent = 'No results, failed to translate request...';

    return null;
  }
}

function handlerInputValue() {
  let query = searchInput.value.trim();

  if (query === '') {
    searchLoader.classList.remove('active');
    searchInput.focus();
    searchResult.textContent = 'Request must not be an empty string, try again...';
  } else {
    searchResult.textContent = '';

    keyboard.hideKeyboard();

    if (/[а-я]/gi.test(query)) {
      (async function getTranslate() {
        query = await handlerQuery(query);

        if (query) {
          movieComponent(query);
        }
      }());
    } else {
      movieComponent(query);
    }
  }
}

function searchComponent() {
  searchKeyboardBtn.addEventListener('click', () => {
    searchInput.focus();
    keyboard.main.classList.toggle('active');
  });

  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    searchLoader.classList.add('active');
    handlerInputValue();
  });

  searchInputReset.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
  });
}

export { movieComponent, searchComponent, handlerInputValue };
