import { Sync } from '../types';
import { prop } from 'ramda';
import { isNonEmpty } from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import { head } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { constant, flow, tuple } from 'fp-ts/lib/function';

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

// extract an object property and map it into a tuple
type ToTuple = <K extends string>(key: K) => <V>(obj: Record<K, V>) => [V];
const toTuple: ToTuple = key => flow(prop(key), tuple);

export { E, success, failure, e, pluck, toTuple };
