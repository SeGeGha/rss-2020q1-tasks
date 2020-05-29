import mapboxgl from 'mapbox-gl';
import apiDirectory from '../directories/apiInfo.directory';

function createMap(locationInfo) {
  const { latitude, longitude } = locationInfo;
  mapboxgl.accessToken = apiDirectory.mapbox.key;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [longitude, latitude],
    zoom: 10,
  });

  const marker = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .addTo(map);
}

export default createMap;
