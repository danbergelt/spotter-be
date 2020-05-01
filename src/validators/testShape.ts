import { Shape } from './validators.types';

const { keys } = Object;

// spreadable args for the test function provided by Yup --> tests the shape of a data against validation
export const testShape = <T, U>(comp: Shape<T>): [string, string, (obj: Shape<U>) => boolean] => [
  'obj shape',
  'Invalid data',
  (obj: Shape<U>): boolean => keys(obj).every(key => key in comp)
];
