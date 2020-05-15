import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/e';
import { Request } from 'express';
import { Either } from 'fp-ts/lib/Either';
import { InsertOneWriteOpResult, ObjectID } from 'mongodb';

export type SyncEither<T> = Either<E, T>;

export type HTTPEither<T> = TaskEither<E, T>;

export interface Req<T> extends Request {
  body: T;
}

export interface Token {
  _id: ObjectID;
}

export type Nullable<T> = T | null;

export type Write = InsertOneWriteOpResult<any>;

export type Saved<T> = { _id: ObjectID } & T;
