import { ErrorRequestHandler } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { failure } from '../utils/httpResponses';

// TODO --> ping sentry with error object
// eslint-disable-next-line
export const fallback: ErrorRequestHandler = (_err, _req, res, _next) => {
  return res.status(INTERNAL_SERVER_ERROR).json(failure({ error: 'Server error' }));
};
