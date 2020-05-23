import { tryCatch } from 'fp-ts/lib/TaskEither';
import bcrypt from 'bcryptjs';
import { HTTPEither } from '../types';
import { serverError } from './errors';

// hashes + salts a string (10 salt rounds, can be bumped if needed)
export const hash = (s: string, bc = bcrypt): HTTPEither<string> =>
  tryCatch(async () => await bc.hash(s, await bc.genSalt(10)), serverError);

// compares a string against a hash
export const compareHash = (s: string, hash: string, bc = bcrypt): HTTPEither<boolean> =>
  tryCatch(async () => await bc.compare(s, hash), serverError);
