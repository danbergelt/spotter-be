import { wrap } from '../utils/wrap';
import { ObjectSchema } from 'yup';
import { Fn } from '../utils/wrap.types';
import { e } from '../utils/e';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';

// validating middleware. accepts a schema and validates the request body.
// the request is then either pushed to the next mw on the stack or diverted to the error middleware

export const vdate = (schema: ObjectSchema | null): Fn => {
  return wrap(async ({ body }, _res, next) => {
    // TODO --> ping a Sentry error about invalid schema
    if (!schema) return next({ message: 'Something went wrong!', status: INTERNAL_SERVER_ERROR });
    try {
      await schema.validate(body);
      return next();
    } catch (error) {
      return next(e(error.message, BAD_REQUEST));
    }
  });
};
