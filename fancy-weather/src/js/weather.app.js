import getUserLocation from './userLocation.requestSender';
import sendRequest from './forecast.requestSender';
import valuesDirectory from './values.directory';
import changeTemperatureUnit from './temperature.changer';
import checkTemperatureUnit from './temperature.checker';
import translationDirectory from './translate.directory';
import moment from '../../node_modules/moment';
import handleData from './apiData.handler';

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
    blockCurrentDate: document.querySelector('.header__date'),
    blockCurrentWeather: {
      tuningValue: document.querySelectorAll('.weather-info-today [data-naming]'),
    },
    blockForecast: {
      day: document.querySelectorAll('.weather-info-three-days .info__day'),
      tuningValue: document.querySelectorAll('.weather-info-three-days [data-naming]'),
    },
    multilingualBlocks: document.querySelectorAll('[data-multilingual]'),
    blockCoordinates: document.querySelectorAll('[data-coordinates'),
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

    dailyWeather.forEach((day, dayId) => {
      this.forecast.dailyWeather[dayId].averageTemp = changeTemperatureUnit(newUnit, day.averageTemp);
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
          current: currentWeatherData,
          daily: dailyWeatherData,
        } = inputData.content;

        moment.locale(this.programSettings.appLanguage);
        this.locationInfo.timezone = inputData.content.timezone_offset / 60;
        this.locationInfo.date = moment().utcOffset(this.locationInfo.timezone).format('ddd D MMMM, HH:mm:ss');

        this.forecast = {
          renderCoordinates: handleData.render.coordinates(this.locationInfo),
          currentWeather: handleData.weatherData.current(currentWeatherData),
          dailyWeather: handleData.weatherData.forecast(dailyWeatherData, {
            lang: this.programSettings.appLanguage,
            timezone: this.locationInfo.timezone,
          }),
        };

        this.render();
      }
        break;
      case requestType.getPlace: { // TODO: HANDLER ERROR 200- 0k
        // TODO: найти city, county, neighbo... village из всех результатов
        this.locationInfo.latitude = inputData.content.results[0].geometry.lat;
        this.locationInfo.longitude = inputData.content.results[0].geometry.lng;

        let resultId = inputData.content.results.findIndex((result) => result.components._type === 'city') || 0;
        
        resultId = (resultId === -1) ? 0 : resultId;
        let city;

        const country = inputData.content.results[resultId].components.country;
        const bbb = inputData.content.results[resultId].components._type;

        switch (bbb) {
          case 'city':
            city = inputData.content.results[resultId].components.city || inputData.content.results[resultId].components.town;
            break;
          case 'county':
            city = inputData.content.results[resultId].components.county;
            break;
          case 'neighbourhood':
            city = inputData.content.results[resultId].components.suburb || inputData.content.results[resultId].components.city;
            break;
          case 'village':
            city = inputData.content.results[resultId].components.village;
            break;
          case 'state':
            city = inputData.content.results[resultId].components.state;
            break;
          case 'townhall':
            city = inputData.content.results[resultId].components.city;
            break;
          default:
            city = inputData.content.results[resultId].components.city || inputData.content.results[resultId].components.state;
            break;
        }

        this.locationInfo.name = `${city} ${country}`;

        const { latitude, longitude } = this.locationInfo;

        sendRequest({ latitude, longitude }, this.programSettings, requestType.getWeather)
          .then((response) => this.dataHandler(response));
      }
        break;
      default:
        document.querySelector('error').textContent = inputData;
        break;
    }
  },

  render() { // TODO:
    const {
      blockLocation,
      blockCurrentDate,
      multilingualBlocks,
      blockCurrentWeather,
      blockForecast,
      blockCoordinates,
    } = this.appComponents;
    const { appLanguage: translationLang } = this.programSettings;
    const countDaysForecast = 3;

    blockLocation.textContent = this.locationInfo.name;
    blockCurrentDate.textContent = this.locationInfo.date;

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

    for (let blockId = 0; blockId < countDaysForecast; blockId += 1) {
      blockForecast.day[blockId].textContent = this.forecast.dailyWeather[blockId + 1].dayName;
      blockForecast.tuningValue[blockId].textContent = this.forecast.dailyWeather[blockId + 1].averageTemp;
    }

    for (let blockId = 0; blockId < blockCoordinates.length; blockId += 1) {
      const blockCode = blockCoordinates[blockId].dataset.coordinates;
      blockCoordinates[blockId].textContent = this.forecast.renderCoordinates[blockCode];
    }
  },
};

export default weatherApplication;
