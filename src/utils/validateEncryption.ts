import { tryCatch } from 'fp-ts/lib/TaskEither';
import bcrypt from 'bcryptjs';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { HTTPEither } from '../types';
import { e } from './e';

// compares a string and an encrypted value

export const validateEncryption = (string: string, encrypted: string): HTTPEither<boolean> => {
  return tryCatch(
    async () => await bcrypt.compare(string, encrypted),
    () => e('Server error', INTERNAL_SERVER_ERROR)
  );
};
