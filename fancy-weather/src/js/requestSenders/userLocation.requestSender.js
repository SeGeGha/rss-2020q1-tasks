import apiDirectory from '../directories/apiInfo.directory';

function getUserLocation() {
  return fetch(apiDirectory.ipInfo.getRequestUrl())
    .then((response) => response.json())
    .then((data) => {
      const UserCoordinates = data.loc.split(',');

      return {
        latitude: UserCoordinates[0],
        longitude: UserCoordinates[1],
      };
    })
    .catch(() => ({ // Minsk
      latitude: 53.902496,
      longitude: 27.561481,
    }));
}

export default getUserLocation;
