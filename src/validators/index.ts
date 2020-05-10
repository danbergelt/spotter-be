import { object, ObjectSchema } from 'yup';
import { user, contact, range, workout, exercise } from './shapes';
import { SCHEMAS } from '../utils/constants';

type CASE = typeof SCHEMAS[keyof typeof SCHEMAS];

// a single function to retrieve a schema by case
// TODO --> namespace into an NPM package and share between FE/BE
export const schema = (CASE: CASE): ObjectSchema => {
  switch (CASE) {
    case SCHEMAS.EXERCISES:
      return object(exercise).noUnknown();
    case SCHEMAS.WORKOUTS:
      return object(workout).noUnknown();
    case SCHEMAS.USERS:
      return object(user).noUnknown();
    case SCHEMAS.CONTACT:
      return object(contact).noUnknown();
    case SCHEMAS.RANGE:
      return object(range).noUnknown();
    default:
      return object();
  }
};
