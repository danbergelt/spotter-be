import * as TE from 'fp-ts/lib/TaskEither';
import { e } from './e';
import { E } from './e.types';

export const tc = <T>(status: number, tryer: () => Promise<T>): TE.TaskEither<E, T> => {
  return TE.tryCatch<E, T>(tryer, error => e((error as Error).message, status));
};
