import { Async } from '../types';
import { Errors, Decoder, ValidationError } from 'io-ts';
import { BAD_REQUEST } from 'http-status-codes';
import { e, E } from '../utils/parsers';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as EI from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

type ParsedValidationError = E;

type FoldError = (v?: ValidationError) => ParsedValidationError;
const foldError: FoldError = v =>
  e(v?.message ? v.message : 'Validation error', BAD_REQUEST);

type ParseErrors = (errors: Errors) => ParsedValidationError;
const parseErrors: ParseErrors = errors =>
  pipe(RA.head(errors), O.fold(foldError, foldError));

// decode a request --> map into a task either, and parse errors into a standard error object
type IO = <T>(d: Decoder<unknown, T>, input: unknown) => Async<T>;
const io: IO = (d, input) =>
  pipe(d.decode(input), EI.mapLeft(parseErrors), TE.fromEither);

export { foldError, parseErrors, io };
