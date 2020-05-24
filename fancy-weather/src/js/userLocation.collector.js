import apiDirectory from './apiInfo.directory';

function getUserLocation() {
  const urlIpInfo = apiDirectory.ipInfo.getRequestUrl();

  return fetch(urlIpInfo)
    .then((response) => response.json())
    .then((userLocationInfo) => {
      const coordinates = userLocationInfo.loc.split(',');

      return {
        latitude: coordinates[0],
        longitude: coordinates[1],
      };
    })
    .catch(() => ({
      latitude: 53.9,
      longitude: 27.57,
    }));
}

export default getUserLocation;
