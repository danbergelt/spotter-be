import { parse, string, type, number, nullable } from 'io-ts/lib/Decoder';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from './tests';
import { right } from 'fp-ts/lib/Either';

export const userDecoder = type({
  email: parse(T.string('Email'), s => pipe(s.trim(), T.isEmail)),
  password: parse(T.string('Password'), s => pipe(s.trim(), s => T.isShort(s, 'Password', 5)))
});

export const contactDecoder = type({
  name: parse(T.string('Name'), s => right(s.trim())),
  email: parse(T.string('Email'), s => pipe(s.trim(), T.isEmail)),
  subject: parse(T.string('Subject'), s => right(s.trim())),
  message: parse(T.string('Message'), s => right(s.trim()))
});

export const exerciseDecoder = type({
  name: parse(T.string('Name'), s => pipe(s.trim(), s => T.isLong(s, 'Exercise name', 26))),
  user: T.isObjectId,
  pr: T.number('Pr'),
  prDate: parse(T.string('Pr date'), s => pipe(s.trim(), T.isDate))
});
