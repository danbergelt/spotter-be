import { Async } from '../types';
import * as ROA from 'fp-ts/lib/ReadonlyArray';
import * as TE from 'fp-ts/lib/TaskEither';
import { ReadonlyNonEmptyArray } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { Lazy } from 'fp-ts/lib/function';

type Message = string;
type Status = number;
type Payload = { [key: string]: unknown };
export type E = { message: Message; status: Status };

// object for returning a successful HTTP response
type Success = (payload: Payload) => { success: true } & Payload;
export const success: Success = payload => ({ success: true, ...payload });

// object for returning a failed HTTP response
type Failure = (payload: Payload) => { success: false } & Payload;
export const failure: Failure = payload => ({ success: false, ...payload });

// build a metadata object to be used when sending emails with mailgun
export type MetaData = {
  from: string;
  to: string;
  subject: string;
  html: string;
};
export const metadata = (
  from: string,
  to: string,
  subject: string,
  html: string
): MetaData => ({
  from,
  to,
  subject,
  html
});

// default error object
type BuilderE = (message: Message, status: Status) => E;
export const e: BuilderE = (message, status) => ({ message, status });

// array length predicate
type IsNonEmpty = (
  e: Lazy<E>
) => <T>(a: ReadonlyArray<T>) => Async<ReadonlyNonEmptyArray<T>>;
export const isNonEmpty: IsNonEmpty = e => TE.fromPredicate(ROA.isNonEmpty, e);
