import * as z from 'zod';
import { object, ObjectSchema } from 'yup';
import { user, contact, range, workout } from './shapes';
import { DATE_REGEX, SCHEMAS } from '../utils/constants';
import { testShape } from './testShape';

const { isArray } = Array;

type CASE = typeof SCHEMAS[keyof typeof SCHEMAS];

// a single function to retrieve a schema by case
// TODO --> namespace into an NPM package and share between FE/BE
export const schema = (CASE: CASE): ObjectSchema => {
  switch (CASE) {
    case SCHEMAS.WORKOUTS:
      return object(workout);
    case SCHEMAS.USERS:
      return object(user).test('shape', 'Invalid data', testShape(user));
    case SCHEMAS.CONTACT:
      return object(contact).test('shape', 'Invalid data', testShape(contact));
    case SCHEMAS.RANGE:
      return object(range).test('date range', 'Invalid data', obj => {
        return (
          testShape(range)(obj) &&
          isArray(obj.range) &&
          obj.range.every((date: string) => DATE_REGEX.test(date))
        );
      });
    default:
      return object();
  }
};
