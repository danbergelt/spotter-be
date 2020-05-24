import { Write } from '../types';
import { Modify } from '../types/index';
import { ObjectId, ObjectID } from 'mongodb';
import { left, right } from 'fp-ts/lib/Either';
import { BAD_REQUEST } from 'http-status-codes';
import { SyncEither } from '../types';
import { Errors } from 'io-ts';
import { validationErr } from './errors';

const { isValid } = ObjectId;

// http success template
export const success = <T>(data = {} as T): Success<T> => ({ success: true, ...data });

// http error template
export const failure = <T>(data = {} as T): Failure<T> => ({ success: false, ...data });

// build a metadata object to be used when sending emails with mailgun
export const metadata = (from: string, to: string, subject: string, html: string): MetaData => ({
  from,
  to,
  subject,
  html
});

// extracts the document from a delete result from mongodb
export const parseModify = <T>(del: Modify<T>): T | null | undefined => del.value;

// parses a MongoDB write and returns the inserted document
export const parseWrite = <T>(write: Write<T>): T => write.ops[0];

// default error object
export const e = (message: string, status: number): E => ({ message, status });

// convert a 24 character hex string into a mongo ObjectID
export const mongofy = (_id: string | ObjectId): SyncEither<ObjectID> =>
  isValid(_id) ? right(new ObjectId(_id)) : left(e('Invalid resource id', BAD_REQUEST));

// parse a decoded validation error
export const parseValidationError = ([{ message }]: Errors): E =>
  validationErr(message ? message : 'Validation error');

export type Success<T> = {
  success: true;
} & T;

export type Failure<T> = {
  success: false;
} & T;

export interface MetaData {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface E {
  message: string;
  status: number;
}
