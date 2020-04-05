import { NextFunction } from 'express';
import Err from './Err';

interface MongooseError extends Error {
  code?: number;
}

export const isMongooseError = (err: MongooseError): false | string => {
  // Mongoose malformed Object ID or failed validation

  if (err.name === 'CastError') {
    return 'Resource not found';
  }

  if (err.name === 'ValidationError') {
    return 'Validation error, check credentials';
  }

  if (err.code === 11000) {
    return 'Duplicate detected, try again';
  }

  return false;
};

export const errorFactory = (
  next: NextFunction,
  err = 'Server error',
  status = 500
): void => {
  return next(new Err(err, status));
};
