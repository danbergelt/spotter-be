import { Request } from 'express';

export const getToken = (req: Request): string | null => {
  // prepare the bearer token and authorization header
  let token: string | null = null;

  if (!req.headers.authorization) {
    return token;
  }

  const { authorization: auth } = req.headers;

  // if the auth header follows OAuth 2.0 syntax, split the token from the string
  if (auth.startsWith('Bearer')) token = auth.split(' ')[1];

  return token;
};
