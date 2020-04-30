import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/e.types';
import { Request } from 'express';

export type HTTPEither<T> = TaskEither<E, T>;

export interface Req<T> extends Request {
  body: T;
}

export interface Token {
  _id: string;
}
