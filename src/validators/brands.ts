import * as t from 'io-ts';
import { either } from 'fp-ts/lib/Either';
import { EMAIL_REGEX } from '../utils/constants';
import { withMessage } from 'io-ts-types/lib/withMessage';
import { withValidate } from 'io-ts-types/lib/withValidate';

// string codec with built-in trimming and a default error message
type Str = (field: string) => t.StringC;
export const str: Str = field =>
  withMessage(
    withValidate(t.string, (u, c) =>
      either.map(t.string.validate(u, c), s => s.trim())
    ),
    () => `${field} must be a string`
  );

// a plain number codec with a default error message
type Num = (field: string) => t.NumberC;
export const num: Num = field =>
  withMessage(t.number, () => `${field} must be a number`);

// a string representation of an email address that must pass an email regex
export const email = withMessage(
  t.brand(
    t.string,
    (e): e is t.Branded<string, { readonly Email: unique symbol }> =>
      EMAIL_REGEX.test(e),
    'Email'
  ),
  () => 'Invalid email'
);

// a string representation of a password that must be at least 6 characters
export const password = withMessage(
  t.brand(
    t.string,
    (p): p is t.Branded<string, { readonly Password: unique symbol }> =>
      p.length > 5,
    'Password'
  ),
  () => 'Password too short (6 char min)'
);

// // a string representation of an exercise name that must be less than 26 chars
// export const exercise = withMessage(
//   t.brand(
//     str('Exercise name'),
//     (e): e is t.Branded<string, { readonly Exercise: unique symbol }> =>
//       e.length < 26,
//     'Exercise'
//   ),
//   () => 'Exercise name too long (25 char max)'
// );

// // a string representation of a date that must match a certain format
// export const strDate = withMessage(
//   t.brand(
//     str('Date'),
//     (d): d is t.Branded<string, { readonly Date: unique symbol }> =>
//       DATE_REGEX.test(d),
//     'Date'
//   ),
//   () => 'Invalid date'
// );

// // a string representation of a valid hex color
// export const hex = withMessage(
//   t.brand(
//     str('Color'),
//     (h): h is t.Branded<string, { readonly Hex: unique symbol }> =>
//       HEX_COLOR_REGEX.test(h),
//     'Hex'
//   ),
//   () => 'Invalid hex color'
// );

// // a string representation of a tag's content
// export const tagContent = withMessage(
//   t.brand(
//     str('Tag content'),
//     (tag): tag is t.Branded<string, { readonly Tag: unique symbol }> =>
//       tag.length < 21,
//     'Tag'
//   ),
//   () => 'Tag content too long (20 char max)'
// );

// // a string representation of a workout title
// export const workoutTitle = withMessage(
//   t.brand(
//     str('Workout title'),
//     (w): w is t.Branded<string, { readonly Title: unique symbol }> =>
//       w.length < 26,
//     'Title'
//   ),
//   () => 'Workout title too long (25 char max)'
// );

// // a number representation of a workout stat
// export const workoutStat = withMessage(
//   t.brand(
//     t.number,
//     (s): s is t.Branded<number, { readonly Stat: unique symbol }> => s < 2001,
//     'Stat'
//   ),
//   () => 'Stat too large (2000 sets/reps/weight max)'
// );

// user foreign key
export const userId = num('User id');

// primary key
export const id = num('Id');

// // raw tag template (used to decode tag input)
// export const tag = t.type({
//   color: hex,
//   user: userId,
//   content: optional(tagContent)
// });

// // saved tag (as it appears inside of a workout as JSON)
// export const savedTag = t.exact(
//   t.intersection([tag, t.type({ id: num('Tag id') })])
// );

// // an exercise as it appears on a saved workout (w/ a name and stats)
// export const workoutExercise = t.exact(
//   t.type({
//     name: exercise,
//     weight: optional(workoutStat),
//     sets: optional(workoutStat),
//     reps: optional(workoutStat)
//   })
// );
