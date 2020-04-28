import { pipe } from 'fp-ts/lib/pipeable';
import { right, left, fold } from 'fp-ts/lib/Either';

// pattern matching + cleaning http error message

export const cleanError = (err: string): string => {
  return pipe(
    err.startsWith('E11000')
      ? left(
          `${err
            .split('index:')[1]
            .split('dup key')[0]
            .split('_')[0]
            .trim()} already exists, try again`
        )
      : right(err),
    fold(
      err => err,
      err => err
    )
  );
};
