import * as t from 'io-ts';
import { DATE_REGEX, EMAIL_REGEX } from '../utils/constants';
import { ObjectId } from 'mongodb';

// mongo object id
const _id = new t.Type<ObjectId, ObjectId, unknown>(
  '_id',
  (i: unknown): i is ObjectId => i instanceof ObjectId,
  (i, context) => (i instanceof ObjectId ? t.success(i) : t.failure(i, context)),
  t.identity
);

// custom string type that trims the input
const str = new t.Type<string, string, unknown>(
  'string',
  (i: unknown): i is string => typeof i === 'string',
  (i, context) => (typeof i === 'string' ? t.success(i.trim()) : t.failure(i, context)),
  t.identity
);

const StrDate = t.brand(
  str,
  (d): d is t.Branded<string, { readonly Date: unique symbol }> => DATE_REGEX.test(d),
  'Date'
);

const Exercise = t.brand(
  str,
  (e): e is t.Branded<string, { readonly Exercise: unique symbol }> => e.length < 26,
  'Exercise'
);

const Email = t.brand(
  str,
  (e): e is t.Branded<string, { readonly Email: unique symbol }> => EMAIL_REGEX.test(e),
  'Email'
);

export const Password = t.brand(
  str,
  (p): p is t.Branded<string, { readonly PW: unique symbol }> => p.length > 5,
  'PW'
);

export default { StrDate, Exercise, Email, Password, str, _id };
