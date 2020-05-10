import keyApiDirectory from '../directory/keyApi';
import receiveData from './dataRequestSender';

function movieComponent(query, pageCount = 1) {
  const apiKey = keyApiDirectory.omdb;
  const urlQueryName = query.replace(/\s/g, '+');
  const programObj = {
    query: urlQueryName,
    page: pageCount,
    key: apiKey,
    userQuery: query,
  };

  receiveData(programObj);
}

export { movieComponent, keyApiDirectory };
