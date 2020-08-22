import { defaultCoordinates } from './navigator';

const { longitude, latitude } = defaultCoordinates;

const mapOptions = {
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v10',
  center: [longitude, latitude],
  zoom: 8,
  attributionControl: false,
  logoPosition: 'top-left',
};

export { mapOptions, defaultCoordinates };
