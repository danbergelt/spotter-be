import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/parsers';
import { Either } from 'fp-ts/lib/Either';

export type Sync<T> = Either<E, T>;
export type Async<T> = TaskEither<E, T>;
export type JWT = { id: number };
