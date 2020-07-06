import getUserLocation from './requestSenders/userLocation.requestSender';
import sendRequest from './requestSenders/forecast.requestSender';
import valuesDirectory from './directories/values.directory';
import changeTemperatureUnit from './functionHelpers/temperature.changer';
import translationDirectory from './directories/translate.directory';
import handleData from './functionHelpers/data.handler';
import getBackgroundImages from './requestSenders/images.requestSender';
import mapManager from './functionHelpers/map.manager';
import clockManager from './functionHelpers/clock.manager';
import { speaker } from './functionHelpers/speech.manager';

const {
  language,
  unit,
  requestType,
  dayTime,
} = valuesDirectory;

const weatherApplication = {
  appComponents: {
    btnTempUnit: document.querySelectorAll('.control__temperature'),
    btnLanguage: document.querySelectorAll('.control__language'),
    blockLocation: document.querySelector('.header__location'),
    blockCurrentDate: document.querySelector('.header__date'),
    blockCurrentWeather: {
      tuningValue: document.querySelectorAll('.weather-info-today [data-naming]'),
      weatherIcon: document.querySelector('.weather-info-today .info__weather-icon'),
    },
    blockForecast: {
      day: document.querySelectorAll('.weather-info-three-days .info__day'),
      tuningValue: document.querySelectorAll('.weather-info-three-days [data-naming]'),
      weatherIcon: document.querySelectorAll('.weather-info-three-days .info__weather-icon'),
    },
    multilingualBlocks: document.querySelectorAll('[data-multilingual]'),
    blockCoordinates: document.querySelectorAll('[data-coordinates'),
    blockPreloader: document.querySelector('#cube-loader'),
    blockError: document.querySelector('.error'),
  },
  programSettings: {
    appLanguage: null,
    appTemperatureUnit: null,
  },
  locationInfo: null,
  forecast: null,
  backgroundImages: {
    currentImageNumber: 0,
    imageDirectory: null,
  },

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
    const isCorrection = true;
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

    this.render(isCorrection);
  },

  translator(newLanguage) {
    this.programSettings.appLanguage = newLanguage;
    localStorage.setItem('appLanguage', newLanguage);
    this.appComponents.blockPreloader.classList.add('active');

    sendRequest(this.locationInfo.name, this.programSettings, requestType.getPlace)
      .then((response) => this.dataHandler(response));
  },

  dataHandler(inputData) {
    switch (inputData.type) {
      case requestType.getWeather: {
        const {
          current: currentWeatherData,
          daily: dailyWeatherData,
          timezone_offset: timezoneOffsetSec,
        } = inputData.content;
        const { appLanguage } = this.programSettings;
        const renderElem = this.appComponents.blockCurrentDate;

        clockManager.init(renderElem, timezoneOffsetSec, appLanguage);
        const { currentYearSeason, currentDayTime } = clockManager.getDateInfo();

        this.forecast = {
          renderCoordinates: handleData.render.coordinates(this.locationInfo),
          currentWeather: handleData.weatherData.current(currentWeatherData, currentDayTime),
          dailyWeather: handleData.weatherData.forecast(dailyWeatherData, dayTime.day),
        };

        const message = handleData.forecastMessage(appLanguage, this.locationInfo.name, this.forecast.currentWeather);
        speaker.init(appLanguage, message);

        const weatherKeyword = this.forecast.currentWeather.weatherIconName;

        const keywords = {
          yearSeason: currentYearSeason,
          weather: weatherKeyword,
          dayTime: currentDayTime,
        };

        getBackgroundImages(keywords)
          .then((response) => this.dataHandler(response));
      }
        break;
      case requestType.getPlace: {
        const result = handleData.searchData(inputData.content, this.programSettings.appLanguage);

        if (!result.message) {
          this.locationInfo.latitude = result.latitude;
          this.locationInfo.longitude = result.longitude;
          this.locationInfo.name = result.name;

          sendRequest(result, this.programSettings, requestType.getWeather)
            .then((response) => this.dataHandler(response));
        } else {
          this.dataHandler(result);
        }
      }
        break;
      case requestType.getImages:
        this.backgroundImages.imageDirectory = inputData.content.photos.photo.filter((imageInfo) => imageInfo.url_h);
        this.render();
        break;
      default:
        this.appComponents.blockPreloader.classList.remove('active');
        this.appComponents.blockError.textContent = inputData.message;
        break;
    }
  },

  backgroundImgChanger() {
    const { currentImageNumber, imageDirectory } = this.backgroundImages;
    const image = new Image();

    this.backgroundImages.currentImageNumber = (currentImageNumber + 1) % imageDirectory.length;
    image.src = imageDirectory[currentImageNumber].url_h;

    image.onload = () => {
      document.body.style.backgroundImage = `url('${image.src}')`;
      this.appComponents.blockPreloader.classList.remove('active');
    };

    image.onerror = () => {
      this.backgroundImages.currentImageNumber += 1;
      image.src = imageDirectory[this.backgroundImages.currentImageNumber].url_h;
    };
  },

  render(isCorrection = false) {
    const {
      blockLocation,
      multilingualBlocks,
      blockCurrentWeather,
      blockForecast,
      blockCoordinates,
    } = this.appComponents;
    const { appLanguage: translationLang } = this.programSettings;
    const countDaysForecast = 3;

    if (!isCorrection) {
      this.backgroundImgChanger();
      mapManager.flyToCoordinates(this.locationInfo);
    }

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

    blockCurrentWeather.weatherIcon.src = this.forecast.currentWeather.weatherIconUrl;

    for (let blockId = 0; blockId < blockCurrentWeather.tuningValue.length; blockId += 1) {
      const blockCode = blockCurrentWeather.tuningValue[blockId].dataset.naming;

      blockCurrentWeather.tuningValue[blockId].textContent = this.forecast.currentWeather[blockCode];
    }

    for (let blockId = 0; blockId < countDaysForecast; blockId += 1) {
      blockForecast.day[blockId].textContent = this.forecast.dailyWeather[blockId + 1].dayName;
      blockForecast.tuningValue[blockId].textContent = this.forecast.dailyWeather[blockId + 1].averageTemp;
      blockForecast.weatherIcon[blockId].src = this.forecast.dailyWeather[blockId + 1].weatherIconUrl;
    }

    for (let blockId = 0; blockId < blockCoordinates.length; blockId += 1) {
      const blockCode = blockCoordinates[blockId].dataset.coordinates;
      blockCoordinates[blockId].textContent = this.forecast.renderCoordinates[blockCode];
    }
  },
};

export default weatherApplication;
