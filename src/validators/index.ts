import { object, ObjectSchema } from 'yup';
import { user, contact, range, workout, exercise } from './shapes';
import { SCHEMAS } from '../utils/constants';
import { Eq } from 'fp-ts/lib/Eq';

type CASE = typeof SCHEMAS[keyof typeof SCHEMAS];
declare const eqSchema: Eq<CASE>;

// pattern matcher that returns a schema by case
// TODO --> namespace into an NPM package and share between FE/BE
export const schema = (CASE: CASE): ObjectSchema => {
  return eqSchema.equals(CASE, SCHEMAS.EXERCISES)
    ? object(exercise).noUnknown()
    : eqSchema.equals(CASE, SCHEMAS.WORKOUTS)
    ? object(workout).noUnknown()
    : eqSchema.equals(CASE, SCHEMAS.USERS)
    ? object(user).noUnknown()
    : eqSchema.equals(CASE, SCHEMAS.CONTACT)
    ? object(contact).noUnknown()
    : eqSchema.equals(CASE, SCHEMAS.RANGE)
    ? object(range).noUnknown()
    : object();
};
