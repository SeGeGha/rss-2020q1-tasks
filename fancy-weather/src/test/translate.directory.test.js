const directory = require('../js/directories/translate.directory').default;

describe('translateDirectory', () => {
  const keys = ['apparentTemp', 'wind', 'humidity', 'windUnit', 'latitude', 'longitude', 'days', 'error'];
  it('should be an object with correct key', () => {
    expect(typeof directory).toEqual('object');

    keys.forEach((key) => {
      expect(Boolean(directory[key])).toBeTruthy();
    });
  });

  const multilingualKeys = ['apparentTemp', 'wind', 'humidity', 'windUnit', 'latitude', 'longitude'];
  const testSubKey = ['en', 'ru', 'be'];

  it('should return correct value for multilingualKeys', () => {
    multilingualKeys.forEach((key) => {
      const subKeys = Object.keys(directory[key])

      expect(subKeys.length).toEqual(3);

      subKeys.forEach((subKey, id) => {
        expect(typeof subKey).toEqual('string');
        expect(subKey).toEqual(testSubKey[id]);
      });
    })
  });

  it('should return correct value', () => {
    expect(directory.searchCity.en).toBe('Search City');
    expect(directory.days[0].ru).toBe('ВСК');
    expect(directory.error.noResult.be).toBe('Няма выніку па вашаму запыту');
    expect(directory.error.failedRequest.ru).toBe('Ошибка запроса, повторите позже');
    expect(directory.latitude.en).toBe('LATITUDE:');
    expect(directory.days[5].be).toBe('ПЯТ');
    expect(directory.error.invalidRequest.be).toBe('Няправільны запыт');
    expect(directory.windUnit.en).toBe('M/S');
  });
});
