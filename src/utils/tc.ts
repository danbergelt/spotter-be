import { pipe, andThen, otherwise } from 'ramda';

// try/catch wrapper that automatically calls next on a failure
// the "tup" is an error override tuple that contains a custom error message and status
// if no overrides are required, pass null to the tuple

export const tc = <T>(thenable: () => Promise<T>) => <U>(cb: (e: string) => U): Promise<T | U> =>
  pipe(
    thenable,
    andThen(value => value),
    otherwise(error => cb(error.message))
  )();
