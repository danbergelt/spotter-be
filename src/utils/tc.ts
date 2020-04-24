import * as TE from 'fp-ts/lib/TaskEither';

export const tc = <T>(tryer: () => Promise<T>): TE.TaskEither<Error, T> => {
  return TE.tryCatch<Error, T>(
    () => tryer(),
    reason => reason as Error
  );
};
