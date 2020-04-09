import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Token } from '../types/auth';
import { ExpressFn } from '../types/index';
import { errorFactory } from '../utils/errorFactory';
import codes from 'http-status-codes';
import asyncHandler from '../utils/asyncHandler';
import { findById } from '../utils/daos';

/*== Auth protection middleware =====================================================

This piece of middleware allows us to authenticate the user prior to accessing
the business logic in the controller. That way, once we authenticate, we can focus on
the functionality specific to that controller with no repetitive auth logic

*/

// return a thunk and inject the errorFactory dependency (for mocking purposes)
export const protect = (
  error = errorFactory,
  handler = asyncHandler,
  UserModel = User,
  findUser = findById
): ExpressFn => {
  return handler(async (req, _, next) => {
    // the bearer token and authorization header
    let token: string | null = null;
    const { authorization: auth } = req.headers;

    // if the auth header follows OAuth 2.0 syntax, split the token from the string
    if (auth?.startsWith('Bearer')) token = auth.split(' ')[1];

    // Check the token is not null
    if (!token) return error(next, 'Access denied', codes.UNAUTHORIZED);

    // verify the token with the JWT secret
    const secret = process.env.JWT_SECRET as string;

    // the id pulled from the token
    let id: string;

    // verify the token and decode the id
    try {
      id = (jwt.verify(token, secret) as Token).id;
    } catch (_) {
      return error(next, 'Access denied', codes.UNAUTHORIZED);
    }

    // fetch the user from the id
    const user = await findUser(UserModel, id);

    // if no user is found, throw an error
    if (!user) return error(next, 'User not found', codes.NOT_FOUND);

    // attach the user to the request body and
    req.user = user;

    // move on to the next operation
    next();
  });
};
