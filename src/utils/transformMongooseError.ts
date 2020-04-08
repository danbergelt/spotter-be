import { MongooseError, TransformedMongooseError } from '../types';
import codes from 'http-status-codes';

export const transformMongooseError = (
  err: MongooseError
): TransformedMongooseError => {
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

  return { message: 'Bad gateway', status: codes.BAD_GATEWAY };
};
