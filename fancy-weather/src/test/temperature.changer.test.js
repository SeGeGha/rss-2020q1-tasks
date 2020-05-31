import changeTemperatureUnit from '../js/functionHelpers/temperature.changer';

describe('check "changeTemperatureUnit" function', () => {
  it('should return string value', () => {
    expect(changeTemperatureUnit('°C', '55°F')).not.toBeNull();
    expect(changeTemperatureUnit('°C', '45°F')).not.toBeUndefined();
    expect(changeTemperatureUnit('°F', '16°C')).not.toBeFalsy();
    expect(changeTemperatureUnit('°C', '60°F')).toBeDefined();
    expect(changeTemperatureUnit('°F', '23°C')).toBeTruthy();
    expect(changeTemperatureUnit('°F', '29°C')).toEqual(expect.any(String));
  });

  it('should return value with new unit', () => {
    expect(changeTemperatureUnit('°C', '55°F')).toMatch(/°C/);
    expect(changeTemperatureUnit('°C', '34°F')).toMatch(/°C/);
    expect(changeTemperatureUnit('°C', '77°F')).toMatch(/°C/);
    expect(changeTemperatureUnit('°F', '16°C')).toMatch(/°F/);
    expect(changeTemperatureUnit('°F', '21°C')).toMatch(/°F/);
    expect(changeTemperatureUnit('°F', '35°C')).toMatch(/°F/);
  });

  const celciusValues = [32, 40, 15, 8, -10];
  const fahrenheitValues = [55, 78, 15, 22, 59];

  const tempConverter = {
    celcius(value) {
      return `${Math.round((value - 32) / 1.8)}°C`;
    },
    fahrenheit(value) {
      return `${Math.round(value * 1.8 + 32)}°F`;
    },
  };

  it('should return correct value for conversion celcius-fahrenheit', () => {
    celciusValues.forEach((val) => {
      expect(changeTemperatureUnit('°F', val)).toEqual(tempConverter.fahrenheit(val));
    });
  });

  it('should return correct value for conversion fahrenheit-celcius', () => {
    fahrenheitValues.forEach((val) => {
      expect(changeTemperatureUnit('°C', val)).toEqual(tempConverter.celcius(val));
    });
  });
});
