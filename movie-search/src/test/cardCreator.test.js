import { cardCreatorFunctions } from './test.function';

describe('getCardCreator', () => {
  const testMovieStorage = [
    {
      title: 'testTitle1',
      link: 'testLink1',
      poster: 'testPoster1',
      year: 'testYear1',
      imdbRating: 'testImdbRating1',
    },
    {
      title: 'testTitle2',
      link: 'testLink2',
      poster: 'testPoster2',
      year: 'testYear2',
      imdbRating: 'testImdbRating2',
    },
    {
      title: 'testTitle3',
      link: 'testLink3',
      poster: 'testPoster3',
      year: 'testYear3',
      imdbRating: 'testImdbRating3',
    },
   ];
  const testProgramObj = {
    page: 1,
    query: 'test',
  };

  const result = cardCreatorFunctions.checkResult(testMovieStorage, testProgramObj);
  const firstKey = result.movieCardStorage;
  const secondKey = result.pageNumber;
  const thirdKey = result.query;

  it('result should be an object with keys count = 3', () => {
    expect(result).toEqual(expect.any(Object));
    expect(Object.keys(result).length).toEqual(3);
  });

  it('first key should be an array with string elements', () => {
    expect(firstKey).toEqual(expect.any(Array));
    firstKey.forEach((item) => {
      expect(typeof item).toEqual('string');
    });
  });

  it('second key should be a number > 0', () => {
    expect(typeof secondKey).toEqual('number');
    expect(secondKey).toBeGreaterThan(0);
  });

  it('third key should be a string, but not empty', () => {
    expect(typeof thirdKey).toEqual('string');
    expect(thirdKey.length).not.toBeLessThan(1);
  });
});
