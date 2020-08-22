import mapboxgl from 'mapbox-gl';
import { requestType } from '../configs/appSettings';
import { mapOptions, defaultCoordinates } from '../configs/map';
import { mapbox } from '../directories/apiInfo';
import sendRequest from '../requestSenders/forecast';
import weatherApplication from '../weather.app';

mapboxgl.accessToken = mapbox.key;

const mapManager = {
  coordinates: {
    latitude: defaultCoordinates.latitude,
    longitude: defaultCoordinates.longitude,
  },
  map: new mapboxgl.Map(mapOptions),
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

  document.querySelector('#cube-loader').classList.add('active');
  mapManager.flyToCoordinates({ latitude, longitude });
  sendRequest({ latitude, longitude }, weatherApplication.programSettings, requestType.getPlace)
    .then((data) => weatherApplication.dataHandler(data));
});


export default mapManager;
