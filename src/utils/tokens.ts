import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/models';

// generate a token on demand
export const genToken = (id: string, sec: string, exp: string): string => {
  return jwt.sign({ id }, sec, {
    expiresIn: exp
  });
};

// generate a refresh token on demand
export const refreshToken = (res: Response, token: string): Response => {
  return res.cookie('toll', token, {
    expires: new Date(Number(new Date()) + 604800000),
    httpOnly: process.env.NODE_ENV === 'development' ? false : true
  });
};

// generate a dead refresh token when the user logs out
export const clearRefreshToken = (res: Response): Response => {
  return res.cookie('toll', '', {
    expires: new Date(Date.now() * 0),
    httpOnly: process.env.NODE_ENV === 'development' ? false : true
  });
};

// helper function that sends a token back to the user
// Get token from model, send response
export const sendToken = (
  user: User,
  statusCode: number,
  res: Response
): void => {
  const token: string = user.getToken();
  res.status(statusCode).json({ success: true, token, id: user._id });
};
