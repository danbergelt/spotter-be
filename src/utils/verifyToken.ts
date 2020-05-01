import { tryCatch, Either } from 'fp-ts/lib/Either';
import jwt from 'jsonwebtoken';
import { E } from './e';
import { Token } from '../types';
import { _ } from './errors';

export const verifyToken = (cookie: string): Either<E, Token> =>
  tryCatch(() => jwt.verify(cookie, process.env.REF_SECRET || 'unauthorized') as Token, _);

export type VerifyToken = typeof verifyToken;
