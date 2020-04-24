import { ErrorRequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ErrorObject } from './error.types';

// express error handling middleware. accepts an error object { string, number }
// and returns a response. if the error object is malformed, it returns a default server error

export const error: ErrorRequestHandler = (err: ErrorObject, _req, res, next) => {
  const status = err.status || INTERNAL_SERVER_ERROR;
  const message = err.message || 'Server error';
  res.status(status).json({ success: false, error: message });
  next();
};
