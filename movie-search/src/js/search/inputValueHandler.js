import { movieComponent } from '../movie/main';
import { searchInput, searchResult, searchLoader } from '../directory/globalVariables';
import { keyboard } from '../virtualKeyboard/main';
import handlerQuery from './queryHandler';

function handlerInputValue() {
  const query = searchInput.value.trim();

  if (query === '') {
    searchLoader.classList.remove('active');
    searchInput.focus();
    searchResult.textContent = 'Request must not be an empty string, try again...';
  } else {
    searchResult.textContent = '';

    keyboard.hideKeyboard();

    if (/[а-я]/gi.test(query)) {
      handlerQuery(query)
        .then((result) => {
          if (result) {
            movieComponent(result);
          }
        })
        .catch(() => {
          searchResult.textContent = 'Failed to translate request, try again later...';
        });
    } else {
      movieComponent(query);
    }
  }
}

export default handlerInputValue;
