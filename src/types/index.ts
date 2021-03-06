import { Request, Response, NextFunction } from 'express';
import { Schema, Model, Document, Error } from 'mongoose';
import HttpError from '../utils/HttpError';
import { Workout, ExerciseOnWorkoutSchema, User } from './models';

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>; // eslint-disable-line

export interface DefaultCascadeParams {
  id: Schema.Types.ObjectId;
  Model: Model<Document, {}>;
}

export interface CascadeUpdateParams extends DefaultCascadeParams {
  update: string;
}

export type Cascade<T> = (params: T, dbCall?: Function) => Promise<void>;

export type MongooseError =
  | Error.ValidationError
  | Error.CastError
  | Error.DocumentNotFoundError
  | Error.MissingSchemaError
  | Error.ParallelSaveError;

export interface TransformedMongooseError {
  message: string;
  status: number;
}

export type AnyError = HttpError | MongooseError;

export interface Pr extends Pick<Workout, '_id' | 'date'> {
  exercises: ExerciseOnWorkoutSchema;
}

export type PrHashTable = Record<string, [number, string | undefined]>;

export interface Stage {
  [stage: string]: unknown;
}

export interface Body {
  [key: string]: string;
}

export interface MailMetadata {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface UserStagedForPasswordReset {
  user: User;
  token: string;
}

interface MutateMany {
  n?: number | undefined;
  ok?: number | undefined;
}

export interface UpdateMany extends MutateMany {
  nModified?: number | undefined;
}

export interface DeleteMany extends MutateMany {
  deletedCount?: number | undefined;
}
