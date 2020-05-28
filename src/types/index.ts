import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/parsers';
import { QueryResult } from 'pg';
import { Either } from 'fp-ts/lib/Either';
import { Saved } from '../validators/decoders';

export type Sync<T> = Either<E, T>;

export type Async<T> = TaskEither<E, T>;

export interface Token {
  id: number;
}

export type Nullable<T> = T | null;

export type Query<T> = QueryResult<Saved<T>>;
