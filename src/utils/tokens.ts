import { Response } from 'express';
import jwt from 'jsonwebtoken';

/*== tokenFactory =====================================================

Output a JSON Web Token with the provided user id, token secret, and
expiry date

*/

export const tokenFactory = (
  id: string,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign({ id }, secret, {
    expiresIn
  });
};

/*== setRefreshToken =====================================================

Set a refresh token to the response object. This is used to authenticate a
logged-in user so that they can receive a fresh authentication token

*/

export const setRefreshToken = (res: Response, token: string): void => {
  res.cookie('toll', token, {
    expires: new Date(Number(new Date()) + 604800000),
    httpOnly: process.env.NODE_ENV === 'development' ? false : true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none'
  });
};
