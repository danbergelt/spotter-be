import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { COOKIE_NAME } from './constants';
import { Sync, Token } from '../types';
import { unauthorized } from './errors';
import { tryCatch } from 'fp-ts/lib/Either';

const { REF_SECRET, REF_EXPIRE, JWT_SECRET, JWT_EXPIRE } = process.env;

// verifies a JWT with the passed-in secret
export const verifyJwt = (sec: string, verify = jwt.verify) => (token: string): Sync<Token> =>
  tryCatch(() => verify(token, sec) as Token, unauthorized);

// generates an auth token
export const token = (id: number, tokenFactory = jwt): string =>
  tokenFactory.sign({ id }, String(JWT_SECRET), {
    expiresIn: String(JWT_EXPIRE)
  });

// returns data needed to set a refresh token
export const cookie = (
  id: number,
  tokenFactory: typeof jwt,
  ops: CookieOptions
): [string, string, CookieOptions] => [
  COOKIE_NAME,
  tokenFactory.sign({ id }, String(REF_SECRET), { expiresIn: String(REF_EXPIRE) }),
  ops
];
