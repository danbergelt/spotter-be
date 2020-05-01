import { tryCatch } from 'fp-ts/lib/TaskEither';
import bcrypt from 'bcryptjs';
import { HTTPEither } from '../types';
import { serverError } from './errors';

// compares a string and an encrypted value

export const validateEncryption = (s: string, enc: string, bc = bcrypt): HTTPEither<boolean> => {
  return tryCatch(async () => await bc.compare(s, enc), serverError);
};
