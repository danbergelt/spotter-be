import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/parsers';
import { QueryResult } from 'pg';
import { Request } from 'express';
import { Either } from 'fp-ts/lib/Either';
import { Saved, Exercise, User, Tag, Workout } from '../validators/decoders';

export type Sync<T> = Either<E, T>;

export type Async<T> = TaskEither<E, T>;

export interface Req<T = {}> extends Request {
  body: T;
}

export interface Token {
  id: number;
}

export type Nullable<T> = T | null;

export type Raw<T> = Omit<T, 'id' | 'user'>;
export type RawExercise = Raw<Exercise>;
export type RawUser = Raw<User>;
export type RawTag = Raw<Tag>;
export type RawWorkout = Raw<Workout>;

export type Query<T> = QueryResult<Saved<T>>;
