import { unit } from '../configs/appSettings';

function changeTemperatureUnit(newUnit, temperatureString) {
  let newTemperatureString;

  if (newUnit === unit.celsius) {
    newTemperatureString = `${Math.round((parseInt(temperatureString, 10) - 32) / 1.8)}${unit.celsius}`;
  } else if (newUnit === unit.fahrenheit) {
    newTemperatureString = `${Math.round(parseInt(temperatureString, 10) * 1.8 + 32)}${unit.fahrenheit}`;
  }

  return newTemperatureString;
}

export default changeTemperatureUnit;
