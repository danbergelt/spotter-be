import jwt from 'jsonwebtoken';
import { Sync, JWT } from '../types';
import { unauthorized } from './errors';
import { tryCatch } from 'fp-ts/lib/Either';
import { constant } from 'fp-ts/lib/function';

type Verifier = typeof jwt.verify;
type Signer = typeof jwt.sign;
type Secret = string;
type Token = string;

interface TokenConfig {
  id: number;
  secret: Secret;
  exp: string;
}

const error = constant(unauthorized);

// verifies a JWT with the passed-in secret
type VerifyJwt = (s: Secret, v?: Verifier) => (t: Token) => Sync<JWT>;
export const verifyJwt: VerifyJwt = (s, v = jwt.verify) => t =>
  tryCatch(() => v(t, s) as JWT, error);

// generates an auth token
type TokenFactory = (tc: TokenConfig, s?: Signer) => Token;
export const tokenFactory: TokenFactory = (tc, s = jwt.sign) =>
  s({ id: tc.id }, tc.secret, { expiresIn: tc.exp });
