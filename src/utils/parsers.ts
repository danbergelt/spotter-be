import { Sync } from '../types';
import { isNonEmpty } from 'fp-ts/lib/ReadonlyArray';
import * as EI from 'fp-ts/lib/Either';
import { head } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { flow } from 'fp-ts/lib/function';

interface Payload {
  [key: string]: unknown;
}

interface E {
  message: string;
  status: number;
}

// object for returning a successful HTTP response
type Success = (p: Payload) => { success: true } & Payload;
const success: Success = p => ({ success: true, ...p });

// object for returning a failed HTTP response
type Failure = (p: Payload) => { success: false } & Payload;
const failure: Failure = p => ({ success: false, ...p });

// default error object
type EBuilder = (message: string, status: number) => E;
const e: EBuilder = (message, status) => ({ message, status });

// verify a non empty array and pluck its head
type Pluck = (error: E) => <T>(a: ReadonlyArray<T>) => Sync<T>;
const pluck: Pluck = error =>
  flow(
    EI.fromPredicate(isNonEmpty, () => error),
    EI.map(head)
  );

export { E, success, failure, e, pluck };
