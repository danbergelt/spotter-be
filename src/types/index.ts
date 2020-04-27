import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/e.types';

export type HTTPEither<T> = TaskEither<E, T>;
