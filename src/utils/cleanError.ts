import { pipe } from 'fp-ts/lib/pipeable';

// pattern matching + cleaning http error message

export const cleanError = (e: string): string => {
  return e.startsWith('E11000')
    ? pipe(
        e
          .split('index:')[1]
          .split('dup key')[0]
          .split('_')[0]
          .trim(),
        e => e[0].toUpperCase() + e.slice(1),
        e => `${e} already exists, try again`
      )
    : e;
};
