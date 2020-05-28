import { mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Async } from '../types';
import { Errors, Decoder } from 'io-ts';
import { BAD_REQUEST } from 'http-status-codes';
import { e, E } from '../utils/parsers';
import { fromEither } from 'fp-ts/lib/TaskEither';

// accepts any decoder, performs validation, and either returns the object as a right or maps into a validation error
const parse = ([{ message }]: Errors): E => e(message ? message : 'Validation error', BAD_REQUEST);
export const io = <O, I>(d: Decoder<unknown, O>, I: I): Async<O> =>
  pipe(d.decode(I), mapLeft(parse), fromEither);
