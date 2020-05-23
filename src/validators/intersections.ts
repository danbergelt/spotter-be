import { Email, Password, Exercise, str, _id, Hex, Tag, StrDate } from './brands';
import * as t from 'io-ts';
import { withMessage } from 'io-ts-types/lib/withMessage';

/*== Intersections =====================================================

Intersections allow us to combine individual io-ts type checks into one
single type

*/

// checks a string, returns an error message
export const isValidString = (x: string): typeof str =>
  withMessage(str, () => `Invalid ${x} - must be string`);

//checks a number, returns an error message
export const isValidNum = (x: string): typeof t.number =>
  withMessage(t.number, () => `Invalid ${x} - must be number`);

// checks that the user foreign key is a valid Object Id
export const UserId = withMessage(_id, () => 'Invalid user id');

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

// intersects isValidString with a hex color regex
export const HexString = t.intersection([
  isValidString('color'),
  withMessage(Hex, () => 'Invalid color - must be hex')
]);

// intersects isValidString with a max length check
export const TagString = t.intersection([
  isValidString('tag content'),
  withMessage(Tag, () => 'Tag content too long (20 char max)')
]);

// intersects isValidString with a date check
export const DateString = t.intersection([
  isValidString('date'),
  withMessage(StrDate, () => 'Invalid date')
]);
