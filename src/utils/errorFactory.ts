import { NextFunction } from 'express';
import HttpError from './HttpError';
import codes from 'http-status-codes';

/*== Error factory =====================================================

This function returns Http error objects when invoked. If no message and/or
status is provided, default values are provided

*/

export const errorFactory = (
  next: NextFunction,
  message = 'Server error',
  status = codes.INTERNAL_SERVER_ERROR
): void => {
  return next(new HttpError(message, status));
};
