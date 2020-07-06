import mapboxgl from 'mapbox-gl';
import apiDirectory from '../directories/apiInfo.directory';
import valuesDirectory from '../directories/values.directory';
import sendRequest from '../requestSenders/forecast.requestSender';
import weatherApplication from '../weather.app';

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

mapManager.map.on('click', (event) => {
  const { lat: latitude, lng: longitude } = event.lngLat;
  const { requestType } = valuesDirectory;

  document.querySelector('#cube-loader').classList.add('active');
  mapManager.flyToCoordinates({ latitude, longitude });
  sendRequest({ latitude, longitude }, weatherApplication.programSettings, requestType.getPlace)
    .then((data) => weatherApplication.dataHandler(data));
});


export default mapManager;
