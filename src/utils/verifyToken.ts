import { tryCatch, Either } from 'fp-ts/lib/Either';
import jwt from 'jsonwebtoken';
import { e } from './e';
import { BAD_REQUEST } from 'http-status-codes';
import { E } from './e.types';
import { Token } from '../types';

export const verifyToken = (cookie: string): Either<E, Token> =>
  tryCatch(
    () => jwt.verify(cookie, process.env.REF_SECRET || 'unauthorized') as Token,
    () => e('_', BAD_REQUEST)
  );
