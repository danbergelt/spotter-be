import { tryCatch } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import jwt from 'jsonwebtoken';
import { Token } from '../types';
import { _, unauthorized } from './errors';
import bcrypt from 'bcryptjs';
import { HTTPEither, SyncEither } from '../types';
import { serverError } from './errors';

// verifies a JWT with the passed-in secret

export const verifyJwt = (token: string, sec: string, verify = jwt.verify): SyncEither<Token> => {
  return tryCatch(() => verify(token, sec) as Token, unauthorized);
};

// compares a string and an encrypted value

export const verifyEncryption = (s: string, enc: string, bc = bcrypt): HTTPEither<boolean> => {
  return TE.tryCatch(async () => await bc.compare(s, enc), serverError);
};
