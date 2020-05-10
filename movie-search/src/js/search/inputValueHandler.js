import { movieComponent } from '../movie/main';
import { searchInput, searchResult, searchLoader } from '../directory/globalVariables';
import { keyboard } from '../virtualKeyboard/main';
import handlerQuery from './queryHandler';

function handlerInputValue() {
  debugger;
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

export default handlerInputValue;
