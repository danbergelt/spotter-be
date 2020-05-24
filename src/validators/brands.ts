import * as t from 'io-ts';
import { DATE_REGEX, EMAIL_REGEX, HEX_COLOR } from '../utils/constants';
import { ObjectId } from 'mongodb';

/*== Branded types =====================================================

Branded types are custom runtime types that are encoded with additional
parameters, e.g. length, regex validation, and more. 

They allow us to speak about our data in a more granular, specific way --> 
e.g., a password is not just a string, it's a specific type of string 
that must pass certain tests in order to be checked

*/

const { isValid } = ObjectId;

// mongo object id --> checks if id is stringifed ObjectId or literal ObjectId instance
export const _id = new t.Type<ObjectId, ObjectId, unknown>(
  '_id',
  (i: unknown): i is ObjectId => (typeof i === 'string' || i instanceof ObjectId) && isValid(i),
  (i, context) =>
    (typeof i === 'string' || i instanceof ObjectId) && isValid(i)
      ? t.success(new ObjectId(i))
      : t.failure(i, context),
  t.identity
);

// custom string type that trims the input
export const str = new t.Type<string, string, unknown>(
  'string',
  (i: unknown): i is string => typeof i === 'string',
  (i, context) => (typeof i === 'string' ? t.success(i.trim()) : t.failure(i, context)),
  t.identity
);

// a string representation of a date that must match a certain format
export const StrDate = t.brand(
  str,
  (d): d is t.Branded<string, { readonly Date: unique symbol }> => DATE_REGEX.test(d),
  'Date'
);

// a string representation of an exercise name that must be less than 26 chars
export const Exercise = t.brand(
  str,
  (e): e is t.Branded<string, { readonly Exercise: unique symbol }> => e.length < 26,
  'Exercise'
);

// a string representation of an email address that must pass an email regex
export const Email = t.brand(
  str,
  (e): e is t.Branded<string, { readonly Email: unique symbol }> => EMAIL_REGEX.test(e),
  'Email'
);

// a string representation of a password that must be at least 6 characters
export const Password = t.brand(
  str,
  (p): p is t.Branded<string, { readonly PW: unique symbol }> => p.length > 5,
  'PW'
);

// a string representation of a valid hex color
export const Hex = t.brand(
  str,
  (h): h is t.Branded<string, { readonly Hex: unique symbol }> => HEX_COLOR.test(h),
  'Hex'
);

// a string representation of a tag's content
export const Tag = t.brand(
  str,
  (tag): tag is t.Branded<string, { readonly Tag: unique symbol }> => tag.length < 21,
  'Tag'
);

// a string representation of a workout title
export const WorkoutTitle = t.brand(
  str,
  (w): w is t.Branded<string, { readonly Title: unique symbol }> => w.length < 26,
  'Title'
);

// a number representation of a workout stat
export const WorkoutStat = t.brand(
  t.number,
  (s): s is t.Branded<number, { readonly Stat: unique symbol }> => s < 2001,
  'Stat'
);
