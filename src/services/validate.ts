import { mapLeft, Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { Sync } from '../types';
import { Errors } from 'io-ts';
import { BAD_REQUEST } from 'http-status-codes';
import { e, E } from '../utils/parsers';

// accepts any decoder, performs validation, and either returns the object as a right or maps into a validation error
const parse = ([{ message }]: Errors): E => e(message ? message : 'Validation error', BAD_REQUEST);
export const validate = <T>(decoded: Either<Errors, T>): Sync<T> => pipe(decoded, mapLeft(parse));
