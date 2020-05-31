jest.mock('../js/directories/values.directory', () => {
  return {
    unit: {
      celsius: '°C',
      fahrenheit: '°F',
    },
  };
});

jest.mock('../js/functionHelpers/temperature.changer', () => {
  return (temperatureString) => {
    return `${Math.round(parseInt(temperatureString, 10) * 1.8 + 32)}°F`
  };
});

jest.mock('../js/weather.app', () => {
  return {
    programSettings: {
      appTemperatureUnit: '°C',
    },
  };
});

const checkTemperatureUnit = require('../js/functionHelpers/temperature.checker').default;

describe('checkTemperatureUnit with tempUnit - °C', () => {
  it('should return value with °C', () => {
    expect(checkTemperatureUnit('16')).toEqual('16°C');
    expect(checkTemperatureUnit('44')).toEqual('44°C');
    expect(checkTemperatureUnit('32')).toEqual('32°C');
    expect(checkTemperatureUnit('-14')).toEqual('-14°C');
    expect(checkTemperatureUnit('9')).toEqual('9°C');
    expect(checkTemperatureUnit('-5')).toEqual('-5°C');
  });
});
