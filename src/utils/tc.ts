import { pipe, andThen, otherwise } from 'ramda';

// declarative try/catch replacement. calls a thenable, which then pipes the resolved promise
// into the andThen function, or pipes the error into the otherwise function

export const tc = <T>(thenable: () => Promise<T>) => <U>(cb: (e: string) => U): Promise<T | U> =>
  pipe(
    thenable,
    andThen(value => value),
    otherwise(error => cb(error.message))
  )();
