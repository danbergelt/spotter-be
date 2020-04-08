import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Token } from '../types/auth';
import { ExpressFn, MongooseError } from '../types/index';
import { errorFactory } from '../utils/errorFactory';
import { transformMongooseError } from '../utils/transformMongooseError';
import codes from 'http-status-codes';
import mongoose from 'mongoose';

/*== Auth protection middleware =====================================================

This piece of middleware allows us to authenticate the user prior to accessing
the business logic in the controller. That way, once we authenticate, we can focus on
the functionality specific to that controller with no repetitive auth logic

*/

// return a thunk and inject the errorFactory dependency (for mocking purposes)
export const protect = (error = errorFactory): ExpressFn => {
  return async (req, _, next): Promise<void> => {
    // the bearer token and authorization header
    let token: string | null = null;
    const { authorization } = req.headers;

    // if the auth header follows OAuth 2.0 syntax, split the token from the string
    if (authorization?.startsWith('Bearer'))
      token = authorization.split(' ')[1];

    // Check the token is not null
    if (!token) return error(next, 'Access denied', codes.UNAUTHORIZED);

    try {
      // verify the token with the JWT secret
      const secret = process.env.JWT_SECRET as string;
      const { id } = jwt.verify(token, secret) as Token;

      // once verified, find the user, and attach it to the request body;
      const user = await User.findById(id);
      if (!user) return error(next, 'User not found', codes.NOT_FOUND);
      req.user = user;

      // continue to the business logic
      next();
    } catch (err) {
      // check if the caught error is a mongoose error
      if (err instanceof mongoose.Error) {
        const { message, status } = transformMongooseError(
          err as MongooseError
        );
        return error(next, message, status);
      }

      // otherwise, return a generic access denied message
      return error(next, 'Access denied', codes.UNAUTHORIZED);
    }
  };
};
