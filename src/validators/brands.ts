import * as t from 'io-ts';
import { DATE_REGEX, EMAIL_REGEX } from '../utils/constants';
import { ObjectId } from 'mongodb';

/*== Branded types =====================================================

Branded types are custom runtime types that are encoded with additional
parameters, e.g. length, regex validation, and more. 

They allow us to speak about our data in a more granular, specific way --> 
e.g., a password is not just a string, it's a specific type of string 
that must pass certain tests in order to be successfully validated

*/

// mongo object id
export const _id = new t.Type<ObjectId, ObjectId, unknown>(
  '_id',
  (i: unknown): i is ObjectId => i instanceof ObjectId,
  (i, context) => (i instanceof ObjectId ? t.success(i) : t.failure(i, context)),
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
