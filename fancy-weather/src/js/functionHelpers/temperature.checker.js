import { unit } from '../configs/appSettings';
import weatherApplication from '../weather.app';
import changeTemperatureUnit from './temperature.changer';

function checkTemperatureUnit(temperature) {
  const { appTemperatureUnit } = weatherApplication.programSettings;
  const isFahrenheit = appTemperatureUnit === unit.fahrenheit;

  return (isFahrenheit) ? changeTemperatureUnit(unit.fahrenheit, Math.round(temperature)) : `${Math.round(temperature)}${unit.celsius}`;
}

export default checkTemperatureUnit;
