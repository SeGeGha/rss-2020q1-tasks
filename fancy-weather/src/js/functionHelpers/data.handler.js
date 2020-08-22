import weatherIdDirectory from '../directories/weatherId';
import translationDirectory from '../directories/translate';
import clockManager from './clock.manager';
import checkTemperatureUnit from './temperature.checker';

const { error } = translationDirectory;

const handleData = {
  weatherData: {
    current(currentWeatherData, currentDayTime) {
      const { id, description } = currentWeatherData.weather[0];

      return {
        weatherDescription: description,
        weatherIconName: weatherIdDirectory[id].name,
        weatherIconUrl: weatherIdDirectory[id][currentDayTime],
        temp: checkTemperatureUnit(currentWeatherData.temp),
        apparentTemp: checkTemperatureUnit(currentWeatherData.feels_like),
        windSpeed: currentWeatherData.wind_speed.toFixed(1),
        humidity: `${currentWeatherData.humidity}%`,
      };
    },
    forecast(dailyWeatherData, currentDayTime) {
      return dailyWeatherData.map((weatherForDay, dayId) => {
        const { min: minTemp, max: maxTemp } = weatherForDay.temp;
        const { id } = weatherForDay.weather[0];

        return {
          dayName: clockManager.getNextDayName(dayId),
          weatherIconUrl: weatherIdDirectory[id][currentDayTime],
          averageTemp: checkTemperatureUnit(Math.round((minTemp + maxTemp) / 2)),
        };
      });
    },
  },
  searchData(placeInfoData, appLanguage) {
    let result;
    
    switch (placeInfoData.status.code) {
      case 200: {
        const hasData = placeInfoData.results.length;

        if (hasData) {
          const localityTypes = [
            'city', 'county', 'state', 'neighbourhood', 'townhall', 'village', 'road', 'attraction',
            'monument',
          ];
          let locationInfo;
          let localityName;
          const localityType = localityTypes.find((type) => {
            locationInfo = placeInfoData.results.find((res) => res.components._type === type);
            return locationInfo;
          });

          locationInfo = locationInfo || placeInfoData.results[0];

          switch (localityType) {
            case 'county':
            case 'state':
            case 'village':
              localityName = locationInfo.components[localityType];
              break;
            case 'neighbourhood':
              localityName = locationInfo.components.suburb || locationInfo.components.city;
              break;
            case 'attraction':
            case 'monument':
              localityName = locationInfo.components.state;
              break;
            case 'road':
              localityName = locationInfo.components.city || locationInfo.components.state;
              break;
            default:
              localityName = locationInfo.components.city || locationInfo.components.town;
              break;
          }

          const countryName = locationInfo.components.country;
          const localityFullName = (localityName) ? `${localityName} ${countryName}` : locationInfo.formatted;

          result = {
            name: localityFullName,
            latitude: locationInfo.geometry.lat,
            longitude: locationInfo.geometry.lng,
          };
        } else {
          result = {
            message: error.noResult[appLanguage],
          };
        }
      }
        break;
      case 400:
        result = {
          message: error.invalidRequest[appLanguage],
        };
        break;
      default:
        result = {
          message: error.failedRequest[appLanguage],
        };
        break;
    }

    return result;
  },
  render: {
    coordinates(locationInfo) {
      const locationCoordinates = {
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
      };

      Object.entries(locationCoordinates).forEach((coordinatesArr) => {
        const [coordinatesKey, coordinatesValue] = coordinatesArr;
        const degreesValue = `${Math.trunc(coordinatesValue)}°`;
        const minutesValue = `${Math.abs(Math.trunc((coordinatesValue - Math.trunc(coordinatesValue)) * 60))}'`;

        locationCoordinates[coordinatesKey] = degreesValue + minutesValue;
      });

      return locationCoordinates;
    },
  },
  forecastMessage(language, ...data) {
    const {
      temperature, apparentTemp, wind, humidity, fullWindUnit,
    } = translationDirectory;
    const [location, weather] = data;

    return `${location}. ${temperature[language]} - ${weather.temp}. ${apparentTemp[language]} - 
    ${weather.apparentTemp}. ${weather.weatherDescription}. ${wind[language]} - ${weather.windSpeed} 
    ${fullWindUnit[language]}. ${humidity[language]} - ${weather.humidity}`;
  },
};

export default handleData;
