import { pipe } from 'fp-ts/lib/pipeable';
import { E } from './e';
import { MongoError } from 'mongodb';
import { some, none, chain, fold } from 'fp-ts/lib/Option';
import { badGateway, validationErr } from './errors';

export const isDuplicateKeyError = (e: string): boolean => e.startsWith('E11000');

// pattern matching + cleaning http error message

export const sanitizeError = (e: string): string => {
  return isDuplicateKeyError(e)
    ? pipe(
        e
          .split('index:')[1]
          .split('dup key')[0]
          .split('_')[0]
          .trim(),
        e => e[0].toUpperCase() + e.slice(1),
        e => `${e} already exists, try again`
      )
    : e;
};

// forks a mongo error, handles: no error message, duplicate key error

export const forkMongoError = (error: unknown): E => {
  const { message } = error as MongoError;
  return pipe(
    message ? some(message) : none,
    chain(message => (isDuplicateKeyError(message) ? some(message) : none)),
    fold(
      () => badGateway(),
      message => validationErr(sanitizeError(message))
    )
  );
};
