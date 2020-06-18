import * as TE from 'fp-ts/lib/TaskEither';
import { constant } from 'fp-ts/lib/function';
import bcrypt from 'bcryptjs';
import { Async } from '../types';
import { serverError } from './errors';
import { pipe } from 'fp-ts/lib/pipeable';

type Hasher = typeof bcrypt;
type Hash = string;
type Raw = string;

const error = constant(serverError);
const rounds = 10;

// hashes a string (10 salt rounds, can be bumped if needed)
type HashingFunction = (raw: Raw, bc?: Hasher) => Async<Hash>;
export const hashingFunction: HashingFunction = (raw, bc = bcrypt) =>
  pipe(
    TE.tryCatch(async () => await bcrypt.genSalt(rounds), error),
    TE.chain(salt => TE.tryCatch(async () => await bc.hash(raw, salt), error))
  );

// compares a string against a hash
type CompHash = (raw: Raw, hash: Hash, bc?: Hasher) => Async<boolean>;
export const compareHash: CompHash = (raw, hash, bc = bcrypt): Async<boolean> =>
  TE.tryCatch(async () => await bc.compare(raw, hash), error);
