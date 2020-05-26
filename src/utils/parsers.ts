import { Sync, Async } from '../types';
import { right, left } from 'fp-ts/lib/Either';
import { isEmpty } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import { chainEitherK } from 'fp-ts/lib/TaskEither';

// http success template
type Success<T> = { success: true } & T;
export const success = <T>(data = {} as T): Success<T> => ({ success: true, ...data });

// http error template
type Failure<T> = { success: false } & T;
export const failure = <T>(data = {} as T): Failure<T> => ({ success: false, ...data });

// build a metadata object to be used when sending emails with mailgun
export type MetaData = { from: string; to: string; subject: string; html: string };
export const metadata = (from: string, to: string, subject: string, html: string): MetaData => ({
  from,
  to,
  subject,
  html
});

// default error object
export type E = { message: string; status: number };
export const e = (message: string, status: number): E => ({ message, status });

// parses rows from a db query
export const parseRows = (e: E) => <T>(a: T[]): Sync<T[]> => (isEmpty(a) ? left(e) : right(a));

// couple a task either with an either
export const couple = <T>(te: Async<T>) => <U>(tail: (a: T) => Sync<U>): Async<U> =>
  pipe(te, chainEitherK(tail));

// a is true, return b, else return an error
export const ternary = (e: E) => <T>(a: T) => <U>(b: U): Sync<T> => (b ? right(a) : left(e));
