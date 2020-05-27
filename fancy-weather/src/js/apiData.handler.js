import checkTemperatureUnit from './temperature.checker';
import moment from '../../node_modules/moment';

const handleData = {
  weatherData: {
    current(currentWeatherData) {
      return {
        temp: checkTemperatureUnit(currentWeatherData.temp),
        weatherDescription: currentWeatherData.weather[0].description,
        weatherId: currentWeatherData.weather[0].id,
        apparentTemp: checkTemperatureUnit(currentWeatherData.feels_like),
        windSpeed: currentWeatherData.wind_speed.toFixed(1),
        humidity: `${currentWeatherData.humidity}%`,
      };
    },
    forecast(dailyWeatherData, dateSettings) {
      return dailyWeatherData.map((weatherForDay, dayId) => {
        const { min: minTemp, max: maxTemp } = weatherForDay.temp;

        return {
          dayName: moment().add(dayId, 'd').utcOffset(dateSettings.timezone).format('dddd'),
          weatherId: weatherForDay.weather[0].id,
          averageTemp: checkTemperatureUnit(Math.round((minTemp + maxTemp) / 2)),
        };
      });
    },
  },
  searchData() {

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
        const minutesValue = `${((coordinatesValue - Math.trunc(coordinatesValue)) * 0.6).toFixed(2) * 100}'`;

        locationCoordinates[coordinatesKey] = degreesValue + minutesValue;
      });

      return locationCoordinates;
    },
  },
};

export default handleData;
