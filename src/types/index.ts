import { TaskEither } from 'fp-ts/lib/TaskEither';
import { E } from '../utils/e.types';

export type Res<T> = TaskEither<E, T>;
