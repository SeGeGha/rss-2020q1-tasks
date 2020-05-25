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
    getRequestUrl(coordinates, settings) {
      const { latitude, longitude } = coordinates;
      const { appLanguage: lang } = settings;

      return `${this.url}/data/2.5/onecall?&lat=${latitude}&lon=${longitude}&lang=${lang}&exclude=hourly&units=metric&APPID=${this.key}`;
    },
  },
};

export default apiDirectory;
