import { swiperManager, swiperFunctions } from './test.function';


describe('getSwiperManager', () => {
  it('should be an object with at least 3 properties / methods', () => {
    expect(typeof (swiperManager)).toEqual('object');
    expect(swiperFunctions.getLength()).toBeGreaterThan(2);
  });
});

describe('checkSwiperManagerMethod', () => {
  it('should return true query name', () => {
    expect(swiperFunctions.checkPreviousQueryName({ 
      movieCardStorage: ['TEST'],
      pageNumber: 1,
      queryName: 'TEST',
    })).toEqual('TEST');
  });
});