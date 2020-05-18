import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { CookieOptions } from 'express';
import { COOKIE_NAME } from './constants';
import { SyncEither, Token } from 'src/types';
import { unauthorized } from './errors';
import { tryCatch } from 'fp-ts/lib/Either';

const { REF_SECRET, REF_EXPIRE, JWT_SECRET, JWT_EXPIRE } = process.env;

// verifies a JWT with the passed-in secret
export const verifyJwt = (token: string, sec: string, verify = jwt.verify): SyncEither<Token> =>
  tryCatch(() => verify(token, sec) as Token, unauthorized);

// generates an auth token
export const token = (_id: ObjectID, tokenFactory = jwt): string =>
  tokenFactory.sign({ _id }, String(JWT_SECRET), {
    expiresIn: String(JWT_EXPIRE)
  });

// returns data needed to set a refresh token
export const cookie = (
  _id: ObjectID,
  tokenFactory: typeof jwt,
  ops: CookieOptions
): [string, string, CookieOptions] => [
  COOKIE_NAME,
  tokenFactory.sign({ _id }, String(REF_SECRET), { expiresIn: String(REF_EXPIRE) }),
  ops
];
