import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from './constants';
import { ObjectID } from 'mongodb';

const { REF_SECRET, REF_EXPIRE } = process.env;

// returns data neede to set a refresh token

export const cookie = (
  _id: ObjectID,
  tokenFactory: typeof jwt,
  ops: CookieOptions
): [string, string, CookieOptions] => {
  return [
    COOKIE_NAME,
    tokenFactory.sign({ _id }, String(REF_SECRET), { expiresIn: String(REF_EXPIRE) }),
    ops
  ];
};
