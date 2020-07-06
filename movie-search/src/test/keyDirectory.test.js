import { keyDirectory, keyDirectoryFunctions } from './test.function';

describe('getkeyDirectory', () => {
  it('should return object with keyboards keys', () => {
    expect(keyDirectory).toBeDefined();
    expect(keyDirectory).toEqual(expect.any(Object));
  });

  it('length of directory must be in range [10, 65]', () => {
    const directoryLength = keyDirectoryFunctions.getLength();

    expect(directoryLength).toBeGreaterThan(10);
    expect(directoryLength).toBeLessThan(66);
  });
});

describe('getkeyValue', () => {
  it('key name should contains two value when it is key-letter or key-number', () => {
    const result = keyDirectoryFunctions.getKeyNameValues;
 
    expect(result('keycode-192')).toEqual(true);
    expect(result('keycode-79')).toEqual(true);
    expect(result('keycode-186')).toEqual(true);
    expect(result('keycode-190')).toEqual(true);
    expect(result('keycode-37')).toEqual(false);
    expect(result('keycode-8')).toEqual(false);
    expect(result('keycode-9')).toEqual(false);
    expect(result('keycode-46')).toEqual(false);
  });
 it('should return english key name when object contains key', () => {
   const result = keyDirectoryFunctions.getEnglishKeyName;

   expect(result('keycode-189')).toEqual('-');
   expect(result('keycode-82')).toEqual('r');
   expect(result('keycode-71')).toEqual('g');
   expect(result('keycode-39')).toEqual('→');
   expect(result('keycode-69')).toEqual('e');
 });
});