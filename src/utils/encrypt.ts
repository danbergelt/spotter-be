import bcrypt from 'bcryptjs';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { HTTPEither } from '../types';
import { serverError } from './errors';

// encrypts any string --> if it fails for some reason, return an HTTP error (should not fail encryption silently)

export const encrypt = (s: string, bc = bcrypt): HTTPEither<string> => {
  return tryCatch(async () => {
    const salt = await bc.genSalt(12);
    return await bc.hash(s, salt);
  }, serverError);
};
