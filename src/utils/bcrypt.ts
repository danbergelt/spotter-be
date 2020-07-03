import * as TE from 'fp-ts/lib/TaskEither';
import bcrypt from 'bcryptjs';
import { Async } from '../types';
import { serverError } from './errors';
import { pipe } from 'fp-ts/lib/pipeable';
import { constant } from 'fp-ts/lib/function';

type Hasher = typeof bcrypt;
type Hash = string;

const error = constant(serverError);
const rounds = 10;

// hashes a string (10 salt rounds, can be bumped if needed)
type HashingFunction = (raw: string, bc?: Hasher) => Async<Hash>;
const hashingFunction: HashingFunction = (raw, bc = bcrypt) =>
  pipe(
    TE.tryCatch(async () => await bc.genSalt(rounds), error),
    TE.chain(salt => TE.tryCatch(async () => await bc.hash(raw, salt), error))
  );

// compares a string against a hash
type CompHash = (raw: string, h: Hash, bc?: Hasher) => Async<boolean>;
const compareHash: CompHash = (raw, h, bc = bcrypt) =>
  TE.tryCatch(async () => await bc.compare(raw, h), error);

export { hashingFunction, compareHash };
