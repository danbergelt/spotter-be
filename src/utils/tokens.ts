import { Response } from 'express';
import jwt from 'jsonwebtoken';

// generate a token on demand
export const tokenFactory = (
  id: string,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign({ id }, secret, {
    expiresIn
  });
};

// generate a refresh token on demand
export const setRefreshToken = (res: Response, token: string): void => {
  res.cookie('toll', token, {
    expires: new Date(Number(new Date()) + 604800000),
    httpOnly: process.env.NODE_ENV === 'development' ? false : true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
  });
};
