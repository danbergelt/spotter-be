import { tryCatch, TaskEither } from 'fp-ts/lib/TaskEither';
import { e } from './e';
import { E } from './e.types';

export const tc = <T>(tryer: () => Promise<T>) => (failureStatus: number): TaskEither<E, T> => {
  return tryCatch(tryer, error => e((error as Error).message, failureStatus));
};
