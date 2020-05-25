import { Errors } from 'io-ts';
import { validationErr } from './errors';

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

// default error object
export const e = (message: string, status: number): E => ({ message, status });

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
