import { MongooseError, TransformedMongooseError } from '../types';
import mongoose from 'mongoose';
import codes from 'http-status-codes';

export const transformMongooseError = (
  err: MongooseError
): TransformedMongooseError => {
  // default values
  let message = 'Bad gateway';
  let status = codes.BAD_GATEWAY;

  if (err instanceof mongoose.Error.CastError) {
    message = 'Resource not found (Cast error)';
    status = codes.BAD_REQUEST;
    return { message, status };
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors);
    message = errors.length
      ? String(errors.map(error => error.message))
      : 'Validation error';
    status = codes.BAD_REQUEST;
    return { message, status };
  }

  if (err instanceof mongoose.Error.DocumentNotFoundError) {
    message = 'Resource not found (Document not found error)';
    status = codes.NOT_FOUND;
    return { message, status };
  }

  if (err instanceof mongoose.Error.MissingSchemaError) {
    message = 'Type of resource does not exist';
    status = codes.NOT_FOUND;
    return { message, status };
  }

  if (err instanceof mongoose.Error.ParallelSaveError) {
    message = 'Error handling concurrent requests';
    status = codes.CONFLICT;
    return { message, status };
  }

  return { message, status };
};
