import { ErrorRequestHandler } from 'express';
import Err from '../utils/Err';
import { isMongooseError } from '../utils/errors';

/*== Global error middleware =====================================================

This is middleware to be passed to the top-level app() instance. It takes the err
passed in by a controller and returns it in the response object

*/

// eslint-disable-next-line
const errorHandler: ErrorRequestHandler = (err: Err, _req, res, _next) => {
  // spread the err arg into a clean object, along with the err message
  let error = { ...err };

  // if the error has a message, attach it to our clean object
  if (err.message) error.message = err.message;

  // check if the error is a mongoose error
  const mongooseError = isMongooseError(err);

  // if the error is a mongoose error, use the mongoose error properties in the response object
  if (mongooseError) {
    error = new Err(mongooseError.message, mongooseError.status);
  }

  // return the response object. return some generic values if code &/or message are not found
  return res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
};

export default errorHandler;
