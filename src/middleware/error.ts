import { ErrorRequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { sanitizeError } from '../utils/sanitization';
import { E } from '../utils/e';
import { failure } from '../utils/httpResponses';

export type ErrorObject = Error & E;

// express error handling middleware. accepts an error object { string, number }
// and returns a response. if the error object is malformed, it returns a default server error

// eslint-disable-next-line
export const error: ErrorRequestHandler = (err: ErrorObject, _req, res, _next) => {
  return res
    .status(err.status || INTERNAL_SERVER_ERROR)
    .json(failure({ error: err.message ? sanitizeError(err.message) : 'Server error' }));
};
