import { Email, Password, Exercise } from './brands';
import * as t from 'io-ts';
import { withMessage } from 'io-ts-types/lib/withMessage';

// checks a string, returns an error message
export const isValidString = (x: string): t.StringC => withMessage(t.string, () => `Invalid ${x}`);

// intersects isValidString with an email regex
export const EmailString = t.intersection([
  isValidString('email'),
  withMessage(Email, () => 'Invalid email')
]);

// intersects isValidString with a min length check
export const PasswordString = t.intersection([
  isValidString('password'),
  withMessage(Password, () => 'Password too short (6 char min)')
]);

// intersects isValidString with a max length check
export const ExerciseString = t.intersection([
  isValidString('name'),
  withMessage(Exercise, () => 'Name too long (25 char max)')
]);
