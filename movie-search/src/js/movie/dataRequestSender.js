import { searchResult, searchLoader } from '../directory/globalVariables';
import handlerData from './dataHandler';

async function receiveData(programObj) {
  const { page, key, urlQueryName } = programObj;
  const url = `https://www.omdbapi.com/?s=${urlQueryName}&page=${page}&apikey=${key}`;

  try {
    const queryResult = await fetch(url);
    const pageResult = await queryResult.json();
    const moviesArr = pageResult.Search;

    handlerData(moviesArr, programObj);
  } catch (error) {
    const messageNetworkOffline = 'Network error, please repeat later';
    const messageFetchFailing = 'Problems with API request, try again...';

    searchResult.textContent = (error.message === 'Failed to fetch') ? messageNetworkOffline : messageFetchFailing;

    searchLoader.classList.remove('active');
  }
}

export default receiveData;
