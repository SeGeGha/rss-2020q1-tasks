import { keyApiDirectory } from '../movie/main';
import { searchResult, searchLoader } from '../directory/globalVariables';

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

export default handlerQuery;
