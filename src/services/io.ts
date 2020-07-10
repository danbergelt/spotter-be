import { Async } from '../types';
import { Decoder, Errors } from 'io-ts';
import { BAD_REQUEST } from 'http-status-codes';
import { e, E } from '../utils/parsers';
import * as EI from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { constant, flow } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { validationError } from '../utils/errors';
import { head } from 'fp-ts/lib/ReadonlyArray';

type ValidationError = E;

const genericError = constant(validationError);

// map decoder errors into an error object
type MapError = (errors: Errors) => ValidationError;
const mapError: MapError = flow(
  head,
  O.chain(error => O.fromNullable(error.message)),
  O.fold(genericError, message => e(message, BAD_REQUEST))
);

// decode a request
type IO = <T>(d: Decoder<unknown, T>) => (input: unknown) => Async<T>;
const io: IO = d => flow(d.decode, EI.mapLeft(mapError), TE.fromEither);

export { mapError, io };
