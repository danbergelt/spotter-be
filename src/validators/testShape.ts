import { Shape } from './validators.types';

const { keys } = Object;

// tests the shape of an object against a comparand --> all keys in A must be in B
export const testShape = <T, U>(obj: Shape<T>, comp: Shape<U>): boolean => {
  return keys(obj).every(key => key in comp);
};
