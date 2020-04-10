import { Request } from 'express';

/*== getToken =====================================================

This helper function strips the authorization header from the request, and validates
that it conforms to the standard OAuth Bearer token format. It will then return that
token, which is either null (failed get) or a string (successful get)

*/

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
