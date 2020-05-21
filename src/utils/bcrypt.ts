import { tryCatch } from 'fp-ts/lib/TaskEither';
import bcrypt from 'bcryptjs';
import { HTTPEither } from '../types';
import { serverError } from './errors';

// encrypts any string --> if it fails for some reason, return an HTTP error (should not fail encryption silently)
export const hash = (string: string, bc = bcrypt): HTTPEither<string> =>
  tryCatch(async () => {
    const salt = await bc.genSalt(12);
    return await bc.hash(string, salt);
  }, serverError);

// compares a string against an encrypted value
export const compareHash = (s: string, enc: string, bc = bcrypt): HTTPEither<boolean> =>
  tryCatch(async () => await bc.compare(s, enc), serverError);
