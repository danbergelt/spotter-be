import { Request, Response, NextFunction } from 'express';
import { Schema, Model, Document, Error } from 'mongoose';
import HttpError from 'src/utils/HttpError';

export type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>; // eslint-disable-line

export interface HttpException extends Error {
  code?: number;
  statusCode?: number;
  message: string;
  errors: { message: string }[];
}

export interface DefaultCascadeParams {
  id: Schema.Types.ObjectId;
  Model: Model<Document, {}>;
}

export interface CascadeUpdateParams extends DefaultCascadeParams {
  update: string;
}

export type Cascade<T> = (params: T) => Promise<void>;

export type MongooseError = Error.ValidationError | Error.CastError;

export interface TransformedMongooseError {
  message: string;
  status: number;
}

export type AnyError = HttpError | MongooseError;
