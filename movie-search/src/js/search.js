import { movieComponent, keyApiDirectory } from './movie';

function searchComponent() {
  const searchInput = document.querySelector('.search__field');
  const searchButton = document.querySelector('.search__submit');
  const searchInputReset = document.querySelector('.field__clean');
  const searchResult = document.querySelector('.search__result');
  const searchLoader = document.querySelector('.search__loader');

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
      searchResult.textContent = 'Request must not be an empty string, try again...';

      searchLoader.classList.remove('active');
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
  });
}

export { movieComponent, searchComponent };
