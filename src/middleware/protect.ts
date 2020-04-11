import jwt from 'jsonwebtoken';
import User from '../models/user';
import { Token } from '../types/auth';
import { ExpressFn } from '../types/index';
import { errorFactory } from '../utils/errorFactory';
import codes from 'http-status-codes';
import asyncHandler from '../utils/asyncHandler';
import { findById } from '../utils/daos';
import { getToken } from './protect.functions';

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
    // strip token from the request
    const token = getToken(req);

    // Check the token is not null
    if (!token) return error(next, 'Access denied', codes.UNAUTHORIZED);

    // the id pulled from the token
    let id: string;

    // verify the token and decode the id
    try {
      id = (jwt.verify(token, process.env.JWT_SECRET as string) as Token).id;
    } catch (_) {
      return error(next, 'Access denied', codes.UNAUTHORIZED);
    }

    // fetch the user from the id
    const user = await findUser(UserModel, id);

    // if no user is found, throw an error
    if (!user) return error(next, 'User not found', codes.NOT_FOUND);

    // attach the user to the request body and
    req.id = user._id;

    // move on to the next operation
    next();
  });
};
