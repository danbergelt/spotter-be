import bcrypt from 'bcryptjs';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { HTTPEither } from '../types';
import { e } from './e';

// encrypts any string --> if it fails for some reason, return an HTTP error (should not fail encryption silently)

export const encrypt = (s: string, bc = bcrypt): HTTPEither<string> => {
  return tryCatch(
    async () => {
      const salt = await bc.genSalt(12);
      return await bc.hash(s, salt);
    },
    () => e('Server error', INTERNAL_SERVER_ERROR)
  );
};
