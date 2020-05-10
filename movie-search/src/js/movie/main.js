import keyApiDirectory from '../directory/keyApi';
import receiveData from './dataRequestSender';

function movieComponent(query, pageCount = 1) {
  const apiKey = keyApiDirectory.omdb;
  const urlQueryName = query.replace(/\s/g, '+');
  const programObj = {
    query,
    page: pageCount,
    key: apiKey,
    urlQueryName,
  };

  receiveData(programObj);
}

export { movieComponent, keyApiDirectory };
