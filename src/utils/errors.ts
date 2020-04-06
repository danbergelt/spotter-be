import { NextFunction } from 'express';
import Err from './Err';
import { MongooseError } from '../types';

export const isMongooseError = (err: Err): false | MongooseError => {
  // Mongoose malformed Object ID or failed validation

  let message: string;
  let status: number;

  if (err.name === 'CastError') {
    message = 'Resource not found';
    status = 404;
    return { message, status };
  }

  if (err.name === 'ValidationError') {
    message = String(Object.values(err.errors).map(value => value.message));
    status = 400;
    return { message, status };
  }

  if (err.code === 11000) {
    message = 'Duplicate detected, try again';
    status = 409;
    return { message, status };
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
