import { mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Sync } from '../types';
import { Mixed, Errors } from 'io-ts';
import { BAD_REQUEST } from 'http-status-codes';
import { e, E } from '../utils/parsers';

// accepts any decoder, performs validation, and either returns the object as a right or maps into a validation error
const parse = ([{ message }]: Errors): E => e(message ? message : 'Validation error', BAD_REQUEST);
export const validate = (decoder: Mixed) => <T>(object: T): Sync<T> =>
  pipe(decoder.decode(object), mapLeft(parse));
