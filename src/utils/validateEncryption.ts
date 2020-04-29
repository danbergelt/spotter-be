import { tryCatch } from 'fp-ts/lib/TaskEither';
import bcrypt from 'bcryptjs';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { HTTPEither } from '../types';
import { e } from './e';

// compares a string and an encrypted value

export const validateEncryption = (s: string, enc: string, bc = bcrypt): HTTPEither<boolean> => {
  return tryCatch(
    async () => await bc.compare(s, enc),
    () => e('Server error', INTERNAL_SERVER_ERROR)
  );
};
