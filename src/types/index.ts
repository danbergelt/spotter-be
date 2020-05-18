import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/parsers';
import { Request } from 'express';
import { Either } from 'fp-ts/lib/Either';
import { InsertOneWriteOpResult, ObjectID, FindAndModifyWriteOpResultObject } from 'mongodb';

export type SyncEither<T> = Either<E, T>;

export type HTTPEither<T> = TaskEither<E, T>;

export interface Req<T> extends Request {
  body: T;
}

export interface Token {
  _id: string;
}

export type Nullable<T> = T | null;

export type Write<T> = InsertOneWriteOpResult<Saved<T>>;

export type Del<T> = FindAndModifyWriteOpResultObject<Saved<T>>;

export type Saved<T> = { _id: ObjectID } & T;

export type Owner = { user: ObjectID };
