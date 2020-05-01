import { tryCatch, Either } from 'fp-ts/lib/Either';
import jwt from 'jsonwebtoken';
import { E } from './e';
import { Token } from '../types';
import { _ } from './errors';

const { REF_SECRET } = process.env;

export const verifyJwt = (cookie: string, verify = jwt.verify): Either<E, Token> =>
  tryCatch(() => verify(cookie, String(REF_SECRET)) as Token, _);
