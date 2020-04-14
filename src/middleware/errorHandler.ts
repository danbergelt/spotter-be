import { ErrorRequestHandler as ErrorHandler } from 'express';
import HttpError from '../utils/HttpError';
import { transformMongooseError } from '../utils/transformMongooseError';
import codes from 'http-status-codes';
import mongoose from 'mongoose';
import { AnyError } from '../types';
import { responseFactory } from '../utils/responseFactory';

/*== Global error middleware =====================================================

This is middleware to be passed to the top-level app() instance. It takes the err
passed in by a controller and returns it in the response object

*/

// eslint-disable-next-line
const errorHandler: ErrorHandler = (err: AnyError, _req, res, _next) => {
  // spread the err arg into a clean object, along with the err message
  let transformedError = { ...err } as HttpError;

  if (err.message) transformedError.message = err.message;

  // check if the error is a mongoose error
  if (err instanceof mongoose.Error) {
    const { message, status } = transformMongooseError(err);
    transformedError = new HttpError(message, status);
  }

  const status = transformedError.status || codes.INTERNAL_SERVER_ERROR;
  const error = transformedError.message || 'Server error';

  // return the response object. return some generic values if code &/or message are not found
  return responseFactory(res, status, false, { error });
};

export default errorHandler;
