import jwt from 'jsonwebtoken';
import { Sync, JWT } from '../types';
import { unauthorized } from './errors';
import { tryCatch } from 'fp-ts/lib/Either';

type JWTSecret = string;
type Token = string;
type UserId = number;
type TokenExpiration = string;

// verifies a JWT with the passed-in secret
export const verifyJwt = (sec: JWTSecret, v = jwt.verify) => (
  token: Token
): Sync<JWT> =>
  tryCatch(
    () => v(token, sec) as JWT,
    () => unauthorized
  );

// generates an auth token
export const token = (
  id: UserId,
  sec: JWTSecret,
  exp: TokenExpiration,
  s = jwt.sign
): Token => s({ id }, sec, { expiresIn: exp });
