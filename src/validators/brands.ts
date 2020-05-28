import * as t from 'io-ts';
import { DATE_REGEX, EMAIL_REGEX, HEX_COLOR } from '../utils/constants';
import { withMessage } from 'io-ts-types/lib/withMessage';
import { optional } from 'io-ts-extra';

/*== Branded types =====================================================

Branded types are custom runtime types that are encoded with additional
parameters, e.g. length, regex validation, and more. 

They allow us to speak about our data in a more granular, specific way --> 
e.g., a password is not just a string, it's a specific type of string 
that must pass certain tests in order to be checked

*/

// custom string type that trims the input
export const str = new t.Type<string, string, unknown>(
  'string',
  (i: unknown): i is string => typeof i === 'string',
  (i, context) => (typeof i === 'string' ? t.success(i.trim()) : t.failure(i, context)),
  t.identity
);

// checks a string's validity (must not be null, undefined, or empty), returns an error message
export const isStr = (x: string): typeof str => withMessage(str, () => `${x} must be string`);

// checks a number, returns an error message
export const isNum = (x: string): t.NumberC => withMessage(t.number, () => `${x} must be number`);

// a string representation of a date that must match a certain format
export const strDate = t.intersection([
  isStr('Date'),
  withMessage(
    t.brand(
      str,
      (d): d is t.Branded<string, { readonly Date: unique symbol }> => DATE_REGEX.test(d),
      'Date'
    ),
    () => 'Invalid date'
  )
]);

// a string representation of an exercise name that must be less than 26 chars
export const exercise = t.intersection([
  isStr('Exercise name'),
  withMessage(
    t.brand(
      str,
      (e): e is t.Branded<string, { readonly Exercise: unique symbol }> => e.length < 26,
      'Exercise'
    ),
    () => 'Exercise name too long (25 char max)'
  )
]);

// a string representation of an email address that must pass an email regex
export const email = t.intersection([
  isStr('Email'),
  withMessage(
    t.brand(
      str,
      (e): e is t.Branded<string, { readonly Email: unique symbol }> => EMAIL_REGEX.test(e),
      'Email'
    ),
    () => 'Invalid email'
  )
]);

// a string representation of a password that must be at least 6 characters
export const pw = t.intersection([
  isStr('Password'),
  withMessage(
    t.brand(str, (p): p is t.Branded<string, { readonly PW: unique symbol }> => p.length > 5, 'PW'),
    () => 'Password too short (6 char min)'
  )
]);

// a string representation of a valid hex color
export const hex = withMessage(
  t.brand(
    str,
    (h): h is t.Branded<string, { readonly Hex: unique symbol }> => HEX_COLOR.test(h),
    'Hex'
  ),
  () => 'Invalid hex color'
);

// a string representation of a tag's content
export const tagContent = withMessage(
  t.brand(
    str,
    (tag): tag is t.Branded<string, { readonly Tag: unique symbol }> => tag.length < 21,
    'Tag'
  ),
  () => 'Tag content too long (20 char max)'
);

// a string representation of a workout title
export const workoutTitle = withMessage(
  t.brand(
    str,
    (w): w is t.Branded<string, { readonly Title: unique symbol }> => w.length < 26,
    'Title'
  ),
  () => 'Workout title too long (25 char max)'
);

// a number representation of a workout stat
export const workoutStat = withMessage(
  t.brand(
    t.number,
    (s): s is t.Branded<number, { readonly Stat: unique symbol }> => s < 2001,
    'Stat'
  ),
  () => 'Stat too large (2000 sets/reps/weight max)'
);

// user foreign key
export const userId = isNum('User id');

// primary key
export const id = isNum('Id');

// raw tag template (used to decode tag input)
export const tag = t.type({ color: hex, user: userId, content: optional(tagContent) });

// saved tag (as it appears inside of a workout as JSON)
export const savedTag = t.exact(t.intersection([tag, t.type({ id: isNum('Tag id') })]));

// an exercise as it appears on a saved workout (w/ a name and stats)
export const workoutExercise = t.exact(
  t.type({
    name: exercise,
    weight: optional(workoutStat),
    sets: optional(workoutStat),
    reps: optional(workoutStat)
  })
);
