import mapboxgl from 'mapbox-gl';
import apiDirectory from '../directories/apiInfo.directory';

const [standardLongitude, standardLatitude] = [27.57, 53.9];
mapboxgl.accessToken = apiDirectory.mapbox.key;

const mapManager = {
  coordinates: {
    latitude: standardLatitude,
    longitude: standardLongitude,
  },
  map: new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [standardLongitude, standardLatitude],
    zoom: 8,
    attributionControl: false,
    logoPosition: 'top-left',
  }),
  marker: new mapboxgl.Marker(),

  setMarker() {
    const appMap = this.map;

    this.marker
      .setLngLat([this.coordinates.longitude, this.coordinates.latitude])
      .addTo(appMap);
  },

  flyToCoordinates(locationInfo) {
    this.coordinates.latitude = locationInfo.latitude;
    this.coordinates.longitude = locationInfo.longitude;

    this.map.flyTo({
      center: [this.coordinates.longitude, this.coordinates.latitude],
      speed: 2,
      curve: 1,
      essential: true,
    });

    this.setMarker();
  },
};

export default mapManager;
