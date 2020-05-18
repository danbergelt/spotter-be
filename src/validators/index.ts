import { object, ObjectSchema } from 'yup';
import { user, contact, range, workout, exercise } from './shapes';
import { SCHEMAS } from '../utils/constants';
import { Eq } from 'fp-ts/lib/Eq';

type CASE = typeof SCHEMAS[keyof typeof SCHEMAS];
const { equals }: Eq<CASE> = { equals: (a, b) => a === b };

// pattern matcher that returns a schema by case
export const schema = (CASE: CASE): ObjectSchema => {
  return equals(CASE, SCHEMAS.EXERCISES)
    ? object(exercise).noUnknown()
    : equals(CASE, SCHEMAS.WORKOUTS)
    ? object(workout).noUnknown()
    : equals(CASE, SCHEMAS.USERS)
    ? object(user).noUnknown()
    : equals(CASE, SCHEMAS.CONTACT)
    ? object(contact).noUnknown()
    : equals(CASE, SCHEMAS.RANGE)
    ? object(range).noUnknown()
    : object();
};
