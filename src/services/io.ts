import { Async } from '../types';
import { Decoder, Errors } from 'io-ts';
import { BAD_REQUEST } from 'http-status-codes';
import { e, E } from '../utils/parsers';
import * as EI from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, constant } from 'fp-ts/lib/function';
import { head, fromArray } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import * as O from 'fp-ts/lib/Option';
import { flip, curry } from 'ramda';
import { pipe } from 'fp-ts/lib/pipeable';

type ValidationError = E;

const genericError = constant(e('Validation error', BAD_REQUEST));
const withMessage = pipe(e, flip, curry);

// map decoder errors into an error object
type MapError = (errors: Errors) => ValidationError;
const mapError: MapError = flow(
  fromArray,
  O.map(head),
  O.chain(error => O.fromNullable(error.message)),
  O.fold(genericError, withMessage)
);

// decode a request
type IO = <T>(d: Decoder<unknown, T>) => (input: unknown) => Async<T>;
const io: IO = d => flow(d.decode, EI.mapLeft(mapError), TE.fromEither);

export { mapError, io };
