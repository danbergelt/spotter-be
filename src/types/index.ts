import { Request, Response, NextFunction } from 'express';
import { Schema, Model, Document, Error } from 'mongoose';
import HttpError from 'src/utils/HttpError';
import { Workout, ExerciseOnWorkoutSchema } from './models';

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

export type Cascade<T> = (params: T, dbCall?: Function) => Promise<void>;

export type MongooseError = Error.ValidationError | Error.CastError;

export interface TransformedMongooseError {
  message: string;
  status: number;
}

export type AnyError = HttpError | MongooseError;

export interface Pr extends Pick<Workout, '_id' | 'date'> {
  exercises: ExerciseOnWorkoutSchema;
}

export type PrHashTable = Record<string, [number, string | undefined]>;

export type MongoArg = Record<string, unknown>;
