import jwt from 'jsonwebtoken';
import { Sync, JWT } from '../types';
import { unauthorized } from './errors';
import { tryCatch } from 'fp-ts/lib/Either';

type Verifier = typeof jwt.verify;
type Signer = typeof jwt.sign;
type Secret = string;
type Token = string;

interface TokenConfig {
  id: number;
  sec: Secret;
  exp: string;
}

const error = () => unauthorized;

// verifies a JWT with the passed-in secret
type VerifyJwt = (s: Secret, v?: Verifier) => (t: Token) => Sync<JWT>;
export const verifyJwt: VerifyJwt = (s, v = jwt.verify) => t =>
  tryCatch(() => v(t, s) as JWT, error);

// generates an auth token
type TokenFactory = (tc: TokenConfig, s?: Signer) => Token;
export const tokenFactory: TokenFactory = ({ id, sec, exp }, s = jwt.sign) =>
  s({ id }, sec, { expiresIn: exp });
