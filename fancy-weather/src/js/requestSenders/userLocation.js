import { navigatorOptions, defaultCoordinates } from '../configs/navigator';

const userLocation = {
  coordinates: null,
  get userCoordinates() {
    return this.coordinates;
  },

  set userCoordinates(coords) {
    const { latitude, longitude } = coords;

    this.coordinates = {
      latitude,
      longitude,
    };
  },
}

async function getUserLocation() {
  function setStartCoordinates(coordinates, confirmPromise) {
    userLocation.userCoordinates = coordinates;

    confirmPromise();
  }

  await new Promise((resolve) => {
    navigator
      .geolocation
      .getCurrentPosition(({ coords }) => setStartCoordinates(coords, resolve),
      () => setStartCoordinates(defaultCoordinates, resolve),
      navigatorOptions
    );  
  });

  return userLocation.userCoordinates;
}

export default getUserLocation;
