import { searchResult, searchLoader } from '../directory/globalVariables';
import handlerData from './dataHandler';

async function receiveData(programObj) {
  const { query, page, key } = programObj;
  const url = `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${key}`;

  try {
    const queryResult = await fetch(url);
    const pageResult = await queryResult.json();
    const moviesArr = pageResult.Search;

    handlerData(moviesArr, programObj);
  } catch (error) {
    searchResult.textContent = 'Api key is not valid, please repeat later';
    searchLoader.classList.remove('active');
  }
}

export default receiveData;