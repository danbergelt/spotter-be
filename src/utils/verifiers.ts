import { tryCatch, Either } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import jwt from 'jsonwebtoken';
import { E } from './e';
import { Token } from '../types';
import { _ } from './errors';
import bcrypt from 'bcryptjs';
import { HTTPEither } from '../types';
import { serverError } from './errors';

// verifies a JWT with the passed-in secret

export const verifyJwt = (token: string, secret: string, verify = jwt.verify): Either<E, Token> => {
  return tryCatch(() => verify(token, secret) as Token, _);
};

// compares a string and an encrypted value

export const verifyEncryption = (s: string, enc: string, bc = bcrypt): HTTPEither<boolean> => {
  return TE.tryCatch(async () => await bc.compare(s, enc), serverError);
};
