import getUserLocation from './userLocation.requestSender';
import sendRequest from './forecast.requestSender';
import valuesDirectory from './values.directory';
import changeTemperatureUnit from './temperature.changer';
import checkTemperatureUnit from './temperature.checker';
import translationDirectory from './translate.directory';

const {
  language,
  unit,
  requestType,
  requestError,
} = valuesDirectory;

const weatherApplication = {
  appComponents: {
    btnTempUnit: document.querySelectorAll('.control__temperature'),
    btnLanguage: document.querySelectorAll('.control__language'),
    blockLocation: document.querySelector('.header__location'),
    blockCurrentWeather: {
      tuningValue: document.querySelectorAll('.weather-info-today [data-naming]'),
    },
    blockForecast: {
      tuningValue: document.querySelectorAll('.weather-info-three-days [data-naming]'),
    },
    multilingualBlocks: document.querySelectorAll('[data-multilingual]'),
  },
  programSettings: {
    appLanguage: null,
    appTemperatureUnit: null,
  },
  locationInfo: null,
  forecast: null,

  init() {
    this.defaultSetup();

    getUserLocation().then((locationCoordinates) => {
      this.locationInfo = locationCoordinates;

      sendRequest(this.locationInfo, this.programSettings, requestType.getPlace)
        .then((response) => this.dataHandler(response));
    });
  },

  defaultSetup() {
    const defaultParameters = {
      appLanguage: {
        standardValue: language.english,
        domElements: Array.from(this.appComponents.btnLanguage),
      },
      appTemperatureUnit: {
        standardValue: unit.celsius,
        domElements: Array.from(this.appComponents.btnTempUnit),
      },
    };

    Object.keys(this.programSettings).forEach((setting) => {
      const { standardValue, domElements } = defaultParameters[setting];
      const valueFromLocalStorage = localStorage.getItem(setting);

      this.programSettings[setting] = valueFromLocalStorage || standardValue;

      domElements.find((item) => item.dataset.value === this.programSettings[setting]).classList.add('active');
    });
  },
  changerTempUnit(newUnit) {
    const { currentWeather, dailyWeather } = this.forecast;
    this.programSettings.appTemperatureUnit = newUnit;

    localStorage.setItem('appTemperatureUnit', newUnit);

    Object.keys(currentWeather)
      .filter((key) => key.toLowerCase().includes('temp'))
      .forEach((tempParameter) => {
        this.forecast.currentWeather[tempParameter] = changeTemperatureUnit(newUnit, currentWeather[tempParameter]);
      });

    dailyWeather.averageTemp.forEach((value, id) => {
      this.forecast.dailyWeather.averageTemp[id] = changeTemperatureUnit(newUnit, value);
    });

    this.render();
  },

  translator(newLanguage) {
    this.programSettings.appLanguage = newLanguage;

    localStorage.setItem('appLanguage', newLanguage);

    sendRequest(this.locationInfo, this.programSettings, requestType.getPlace)
      .then((response) => this.dataHandler(response));
  },

  dataHandler(inputData) { // TODO:
    switch (inputData.type) {
      case requestType.getWeather: {
        const {
          timezone_offset: timezone,
          current: currentWeatherData,
          daily: dailyWeatherData,
        } = inputData.content;
        const {
          temp,
          feels_like: apparentTemp,
          humidity,
          wind_speed: windSpeed,
          weather: weatherInfo,
        } = currentWeatherData;

        this.locationInfo.timezone = timezone;

        this.forecast = {
          currentWeather: {
            temp: checkTemperatureUnit(temp),
            weatherDescription: weatherInfo[0].description,
            apparentTemp: checkTemperatureUnit(apparentTemp),
            windSpeed: `${windSpeed.toFixed(1)}`,
            humidity: `${humidity}%`,
          },
          dailyWeather: {
            averageTemp: dailyWeatherData.map((dayWeatherInfo) => {
              const { min: minTemp, max: maxTemp } = dayWeatherInfo.temp;
              const averageTemp = Math.round((minTemp + maxTemp) / 2);

              return checkTemperatureUnit(averageTemp);
            }),
          },
        };

        this.render();
      }
        break;
      case requestType.getPlace: { // TODO: HANDLER ERROR 200- 0k
        this.locationInfo.latitude = inputData.content.results[0].geometry.lat;
        this.locationInfo.longitude = inputData.content.results[0].geometry.lng;
        this.locationInfo.date = inputData.content.timestamp.created_http;
        this.locationInfo.name = inputData.content.results[0].formatted;

        const { latitude, longitude } = this.locationInfo;

        sendRequest({ latitude, longitude }, this.programSettings, requestType.getWeather)
          .then((response) => this.dataHandler(response));
      }
        break;
      case requestError: // TODO: requestSender -> { type: 'error'}
        break;
      default:
        break;
    }
  },

  render() {
    const {
      blockLocation,
      multilingualBlocks,
      blockCurrentWeather,
      blockForecast,
    } = this.appComponents;
    const { appLanguage: translationLang } = this.programSettings;

    blockLocation.textContent = this.locationInfo.name;

    for (let blockId = 0; blockId < multilingualBlocks.length; blockId += 1) {
      const blockCode = multilingualBlocks[blockId].dataset.multilingual;
      const translationName = translationDirectory[blockCode][translationLang];

      if (multilingualBlocks[blockId].tagName.toLowerCase() === 'input') {
        multilingualBlocks[blockId].placeholder = translationName;
      } else {
        multilingualBlocks[blockId].textContent = translationName;
      }
    }

    for (let blockId = 0; blockId < blockCurrentWeather.tuningValue.length; blockId += 1) {
      const blockCode = blockCurrentWeather.tuningValue[blockId].dataset.naming;

      blockCurrentWeather.tuningValue[blockId].textContent = this.forecast.currentWeather[blockCode];
    }

    for (let blockId = 0; blockId < blockForecast.tuningValue.length; blockId += 1) {
      const blockCode = blockForecast.tuningValue[blockId].dataset.naming;

      blockForecast.tuningValue[blockId].textContent = this.forecast.dailyWeather[blockCode][blockId + 1];
    }
  },
};

export default weatherApplication;
