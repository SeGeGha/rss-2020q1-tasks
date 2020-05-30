const apiDirectory = {
  ipInfo: {
    key: 'f371333c36cdea',
    url: 'https://ipinfo.io',
    getRequestUrl() {
      return `${this.url}/json?token=${this.key}`;
    },
  },
  openWeatherMap: {
    key: '804f2d959ae5f66700e8e2ea6b23fabd',
    url: 'https://api.openweathermap.org',
    getRequestUrl(locationCoordinates, settings) {
      const { latitude: lat, longitude: lon } = locationCoordinates;
      const { appLanguage: lang } = settings;

      return `${this.url}/data/2.5/onecall?&lat=${lat}&lon=${lon}&lang=${lang}&exclude=hourly&units=metric&APPID=${this.key}`;
    },
  },
  openCageData: {
    key: '00abdd5e6b454bc39cbae2348c8bba20',
    url: 'https://api.opencagedata.com',
    getRequestUrl(query, settings) {
      const isPlaceName = (typeof query === 'string');
      const preparedQuery = (isPlaceName) ? query.replace(/\s/g, '+') : `${query.latitude}+${query.longitude}`;
      const { appLanguage: lang } = settings;

      return `${this.url}/geocode/v1/json?q=${preparedQuery}&key=${this.key}&language=${lang}&pretty=1&no_annotations=1`;
    },
  },
  flickr: {
    key: 'c1cac9aa60759f58a978608fc41d4bdc',
    url: 'https://www.flickr.com',
    getRequestUrl(tags) {
      console.log('tags for flickr.com:', tags);
      return `${this.url}/services/rest/?method=flickr.photos.search&api_key=${this.key}&tags=${tags}&tag_mode=all&extras=url_h&format=json&nojsoncallback=1`;
    },
  },
  mapbox: {
    key: 'pk.eyJ1Ijoic2VnZWdoYSIsImEiOiJja2FydzB1aGMwOTVuMnNtb2s2YzQwYzFpIn0.5DRUQvTZFKjEzDAjSOW-TA',
  },
};

export default apiDirectory;
