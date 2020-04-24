import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

const { REF_SECRET, REF_EXPIRE } = process.env;

const cookieSettings = {
  expires: new Date(Number(new Date()) + 604800000),
  httpOnly: process.env.NODE_ENV === 'development' ? false : true,
  secure: process.env.NODE_ENV === 'development' ? false : true,
  sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
} as CookieOptions;

export const cookie = (id: string): [string, string, typeof cookieSettings] => {
  return [
    'ref',
    jwt.sign({ id }, String(REF_SECRET), { expiresIn: String(REF_EXPIRE) }),
    cookieSettings
  ];
};
