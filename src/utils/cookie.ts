import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

const { REF_SECRET, REF_EXPIRE } = process.env;

// returns data neede to set a refresh token

export const cookie = (
  id: string,
  tokenFactory: typeof jwt,
  ops: CookieOptions
): [string, string, CookieOptions] => {
  return [
    'ref',
    tokenFactory.sign({ id }, String(REF_SECRET), { expiresIn: String(REF_EXPIRE) }),
    ops
  ];
};
