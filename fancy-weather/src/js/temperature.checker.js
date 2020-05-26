import weatherApplication from './weather.app';
import valuesDirectory from './values.directory';
import changeTemperatureUnit from './temperature.changer';

function checkTemperatureUnit(temperature) {
  const { appTemperatureUnit } = weatherApplication.programSettings;
  const { unit } = valuesDirectory;
  const isFahrenheit = appTemperatureUnit === unit.fahrenheit;

  return (isFahrenheit) ? changeTemperatureUnit(unit.fahrenheit, Math.round(temperature)) : `${Math.round(temperature)}${unit.celsius}`;
}

export default checkTemperatureUnit;
