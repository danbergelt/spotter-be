import { tryCatch } from 'fp-ts/lib/TaskEither';
import bcrypt from 'bcryptjs';
import { Async } from '../types';
import { serverError } from './errors';

// hashes + salts a string (10 rounds, can be bumped if needed)
export const hash = (s: string, bc = bcrypt): Async<string> =>
  tryCatch(async () => await bc.hash(s, await bc.genSalt(10)), serverError);

// compares a string against a hash
export const compareHash = (s: string, hash: string, bc = bcrypt): Async<boolean> =>
  tryCatch(async () => await bc.compare(s, hash), serverError);
