import { NextFunction } from 'express';
import Err from './Err';
import { MongooseError } from '../types';
import codes from 'http-status-codes';

export const isMongooseError = (err: Err): false | MongooseError => {
  // Mongoose malformed Object ID or failed validation

  let message: string;
  let status: number;

  if (err.name === 'CastError') {
    message = 'Resource not found';
    status = codes.NOT_FOUND;
    return { message, status };
  }

  if (err.name === 'ValidationError') {
    message = String(Object.values(err.errors).map(value => value.message));
    status = codes.BAD_REQUEST;
    return { message, status };
  }

  if (err.code === 11000) {
    message = 'Duplicate resource detected';
    status = codes.CONFLICT;
    return { message, status };
  }

  return false;
};

export const errorFactory = (
  next: NextFunction,
  err = 'Server error',
  status = codes.INTERNAL_SERVER_ERROR
): void => {
  return next(new Err(err, status));
};
