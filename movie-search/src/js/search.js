import { movieComponent, keyApiDirectory } from './movie';
import { searchInput, searchResult, searchLoader } from './globalVariables.directory';

function searchComponent() {
  const searchButton = document.querySelector('.search__submit');
  const searchInputReset = document.querySelector('.field__clean');

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
      searchResult.textContent = 'Request must not be an empty string, try again...';
    } else {
      searchResult.textContent = '';

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

  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    searchLoader.classList.add('active');
    handlerInputValue();
  });

  searchInputReset.addEventListener('click', () => {
    searchInput.value = '';
    searchResult.textContent = '';
  });
}

export { movieComponent, searchComponent };
