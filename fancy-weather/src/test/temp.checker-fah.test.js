jest.mock('../js/directories/values.directory', () => {
  return {
    unit: {
      celsius: '°C',
      fahrenheit: '°F',
    },
  };
});

jest.mock('../js/functionHelpers/temperature.changer', () => {
  return (unit, temperatureString) => {
    return `${Math.round(temperatureString * 1.8 + 32)}${unit}`
  };
});

jest.mock('../js/weather.app', () => {
  return {
    programSettings: {
      appTemperatureUnit: '°F',
    },
  };
});

const checkTemperatureUnit = require('../js/functionHelpers/temperature.checker').default;

describe('checkTemperatureUnit with tempUnit - °F', () => {
  it('should return new value with °F', () => {
    expect(checkTemperatureUnit('13')).toEqual('55°F');
    expect(checkTemperatureUnit('25')).toEqual('77°F');
    expect(checkTemperatureUnit('-14')).toEqual('7°F');
    expect(checkTemperatureUnit('-5')).toEqual('23°F');
    expect(checkTemperatureUnit('11')).toEqual('52°F');
    expect(checkTemperatureUnit('0')).toEqual('32°F');
  });
});
