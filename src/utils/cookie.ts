import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from './constants';

const { REF_SECRET, REF_EXPIRE } = process.env;

// returns data neede to set a refresh token

export const cookie = (
  id: string,
  tokenFactory: typeof jwt,
  ops: CookieOptions
): [string, string, CookieOptions] => {
  return [
    COOKIE_NAME,
    tokenFactory.sign({ id }, String(REF_SECRET), { expiresIn: String(REF_EXPIRE) }),
    ops
  ];
};
