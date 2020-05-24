import * as b from './brands';
import * as t from 'io-ts';
import { withMessage } from 'io-ts-types/lib/withMessage';
import { NonEmptyString, NonEmptyStringC } from 'io-ts-types/lib/NonEmptyString';
import { optional } from 'io-ts-extra';

/*== Intersections =====================================================

Intersections allow us to combine individual type checks into one
single, unified type

*/

// checks a string's validity (must not be null, undefined, or empty), returns an error message
const s = t.intersection([b.str, NonEmptyString]);
export const isValidString = (x: string): t.IntersectionC<[typeof b.str, NonEmptyStringC]> =>
  withMessage(s, () => `Invalid ${x} - must be non-empty string`);

// checks a number, returns an error message
export const isValidNum = (x: string): typeof t.number =>
  withMessage(t.number, () => `Invalid ${x} - must be number`);

// checks that the user foreign key is a valid Object Id
export const UserId = withMessage(b._id, () => 'Invalid user id');

// checks that a primary key is a valid Object Id
export const PrimaryKey = withMessage(b._id, () => 'Invalid id');

// intersects isValidString with an email regex
export const EmailString = t.intersection([
  isValidString('email'),
  withMessage(b.Email, () => 'Invalid email')
]);

// intersects isValidString with a min length check
export const PasswordString = t.intersection([
  isValidString('password'),
  withMessage(b.Password, () => 'Password too short (6 char min)')
]);

// intersects isValidString with a max length check
export const ExerciseString = t.intersection([
  isValidString('exercise name'),
  withMessage(b.Exercise, () => 'Exercise name too long (25 char max)')
]);

// intersects isValidString with a hex color regex
export const HexString = t.intersection([
  isValidString('color'),
  withMessage(b.Hex, () => 'Invalid color - must be hex')
]);

// intersects isValidString with a max length check
export const TagString = t.intersection([
  isValidString('tag content'),
  withMessage(b.Tag, () => 'Tag content too long (20 char max)')
]);

// intersects isValidString with a date check
export const DateString = t.intersection([
  isValidString('date'),
  withMessage(b.StrDate, () => 'Invalid date')
]);

// intersects isValidString with a length check
export const WorkoutTitleString = t.intersection([
  isValidString('workout title'),
  withMessage(b.WorkoutTitle, () => 'Workout title too long (25 char max)')
]);

// intersects isValidNum with a size check
export const WorkoutWeight = t.intersection([
  isValidNum('weight'),
  withMessage(b.WorkoutStat, () => '2000 lb limit')
]);

// intersects isValidNum with a size check
export const WorkoutReps = t.intersection([
  isValidNum('reps'),
  withMessage(b.WorkoutStat, () => '2000 reps limit')
]);

// intersects isValidNum with a size check
export const WorkoutSets = t.intersection([
  isValidNum('sets'),
  withMessage(b.WorkoutStat, () => '2000 sets limit')
]);

// template for a tag (need to be able perform intersections later)
export const Tag = t.type({
  color: HexString,
  user: UserId,
  content: optional(TagString)
});

// tag as it exists on a workout (includes a primary key)
export const WorkoutTag = t.exact(t.intersection([Tag, t.type({ _id: PrimaryKey })]));

// exercise as it exists on a workout
export const WorkoutExercise = t.exact(
  t.type({
    name: ExerciseString,
    weight: optional(WorkoutWeight),
    sets: optional(WorkoutSets),
    reps: optional(WorkoutReps)
  })
);
