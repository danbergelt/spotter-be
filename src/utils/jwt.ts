import jwt from 'jsonwebtoken';
import { Sync, Token } from '../types';
import { unauthorized } from './errors';
import { tryCatch } from 'fp-ts/lib/Either';

// verifies a JWT with the passed-in secret
export const verifyJwt = (sec: string, verify = jwt.verify) => (token: string): Sync<Token> =>
  tryCatch(() => verify(token, sec) as Token, unauthorized);

// generates an auth token
export const token = (id: number, sec: string, exp: string, t = jwt): string =>
  t.sign({ id }, sec, { expiresIn: exp });
