import { ErrorRequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ErrorObject } from './error.types';

export const error: ErrorRequestHandler = (err: ErrorObject, _req, res, next) => {
  const status = err.status || INTERNAL_SERVER_ERROR;
  const message = err.message || 'Server error';
  res.status(status).json({ success: false, error: message });
  next();
};
