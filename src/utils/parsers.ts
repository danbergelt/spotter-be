import { Sync } from '../types';
import { isNonEmpty } from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import { head } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { constant, flow, tuple } from 'fp-ts/lib/function';
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord';
import { prop } from 'ramda';

type Payload = { [key: string]: unknown };
type E = { message: string; status: number };

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
  flow(E.fromPredicate(isNonEmpty, constant(error)), E.map(head));

export { E, success, failure, e, pluck };
