import checkTemperatureUnit from './temperature.checker';
import moment from '../../../node_modules/moment';
import weatherIdDirectory from '../directories/weatherId.directory';

const handleData = {
  weatherData: {
    current(currentWeatherData, daysTime) {
      const { id } = currentWeatherData.weather[0];

      return {
        daysTime,
        weatherDescription: currentWeatherData.weather[0].description,
        weatherIconName: weatherIdDirectory[id].name,
        weatherIconUrl: weatherIdDirectory[id][daysTime],
        temp: checkTemperatureUnit(currentWeatherData.temp),
        apparentTemp: checkTemperatureUnit(currentWeatherData.feels_like),
        windSpeed: currentWeatherData.wind_speed.toFixed(1),
        humidity: `${currentWeatherData.humidity}%`,
      };
    },
    forecast(dailyWeatherData, dateSettings, daysTime) {
      return dailyWeatherData.map((weatherForDay, dayId) => {
        const { min: minTemp, max: maxTemp } = weatherForDay.temp;
        const { id } = weatherForDay.weather[0];

        return {
          dayName: moment().add(dayId, 'd').utcOffset(dateSettings.timezone).format('dddd'),
          daysTime,
          weatherIconUrl: weatherIdDirectory[id][daysTime],
          averageTemp: checkTemperatureUnit(Math.round((minTemp + maxTemp) / 2)),
        };
      });
    },
  },
  searchData(placeInfoData) { // TODO STATUS CODE?
    /*
    let resultId = inputData.content.results.findIndex((result) => result.components._type === 'city') || 0;

    resultId = (resultId === -1) ? 0 : resultId;
    let city;

    const { country } = inputData.content.results[resultId].components;
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
    } */

    return {
      latitude: placeInfoData.results[0].geometry.lat,
      longitude: placeInfoData.results[0].geometry.lng,
      name: placeInfoData.results[0].formatted,
    };
  },
  render: {
    coordinates(locationInfo) {
      const { latitude, longitude } = locationInfo;
      const locationCoordinates = {
        latitude,
        longitude,
      };

      Object.entries(locationCoordinates).forEach((coordinatesArr) => {
        const coordinatesKey = coordinatesArr[0];
        const coordinatesValue = coordinatesArr[1];
        const degreesValue = `${Math.trunc(coordinatesValue)}°`;
        const minutesValue = `${Math.trunc((coordinatesValue - Math.trunc(coordinatesValue)) * 60)}'`;

        locationCoordinates[coordinatesKey] = degreesValue + minutesValue;
      });

      return locationCoordinates;
    },
  },
  error(error) {
    document.querySelector('error').textContent = error;
  },
};

export default handleData;
