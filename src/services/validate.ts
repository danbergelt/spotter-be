import { mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Sync } from '../types';
import { Mixed } from 'io-ts';
import { parseValidationError } from '../utils/parsers';

export const validate = (decoder: Mixed) => <T>(object: T): Sync<T> =>
  pipe(decoder.decode(object), mapLeft(parseValidationError));
