import { Decoder, success, failure, DecodeError } from 'io-ts/lib/Decoder';
import { Either, fromNullable, right, left } from 'fp-ts/lib/Either';
import { EMAIL_REGEX, DATE_REGEX } from '../utils/constants';
import { ObjectID } from 'mongodb';

export const string = (entity: string): Decoder<string> => {
  return {
    decode: (s): Either<DecodeError, string> =>
      !s
        ? failure(`${entity} is required`)
        : typeof s !== 'string'
        ? failure(`${entity} must be a string`)
        : success(s)
  };
};

export const number = (entity: string): Decoder<number> => {
  return {
    decode: (n): Either<DecodeError, number> =>
      !n
        ? failure(`${entity} is required`)
        : typeof n !== 'number'
        ? failure(`${entity} must be a number`)
        : success(n)
  };
};

// a string that must be above a certain length
export const isShort = (s: string, entity: string, length: number): Either<string, string> =>
  s.length > length ? right(s) : left(`${entity} is too short (${length} char min)`);

// a non-nullable string
export const isRequired = (entity: string): ((s: string) => Either<string, string>) =>
  fromNullable(`${entity} is required`);

// a string that must be under a certain length
export const isLong = (s: string, entity: string, length: number): Either<string, string> =>
  s.length < length ? right(s) : left(`${entity} is too long (${length} char max)`);

// a string that is a valid email
export const isEmail = (s: string): Either<string, string> =>
  EMAIL_REGEX.test(s) ? right(s) : left('Invalid email');

// a string that is a valid date of mmm/dd/yyyy
export const isDate = (s: string): Either<string, string> =>
  DATE_REGEX.test(s) ? right(s) : left('Invalid date');

// a string that is a valid Ob
export const isObjectId: Decoder<ObjectID> = {
  decode: o => (o instanceof ObjectID ? success(o) : failure('Invalid ID'))
};
