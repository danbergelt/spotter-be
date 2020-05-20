import * as t from 'io-ts';
import { withMessage } from 'io-ts-types/lib/withMessage';
import { optional } from 'io-ts-extra';
import { OId, StringDate } from './brands';
import { ExerciseString, EmailString, PasswordString, isValidString } from './intersections';

// raw user type
export const userDecoder = t.exact(
  t.type({
    email: EmailString,
    password: PasswordString
  })
);

export type User = t.TypeOf<typeof userDecoder>;

// raw contact type
export const contactDecoder = t.exact(
  t.type({
    name: isValidString('name'),
    email: EmailString,
    subject: isValidString('subject'),
    message: isValidString('message')
  })
);

export type Contact = t.TypeOf<typeof contactDecoder>;

// raw exercise type
export const exerciseDecoder = t.exact(
  t.type({
    name: ExerciseString,
    pr: withMessage(optional(t.number), () => 'Invalid pr'),
    prDate: withMessage(optional(StringDate), () => 'Invalid pr date')
  })
);

export type Exercise = t.TypeOf<typeof exerciseDecoder>;

// any input that has a 'user' as a foreign key
export const Owner = t.exact(t.type({ user: withMessage(OId, () => 'Invalid user id') }));

export type Owned<T = {}> = t.TypeOf<typeof Owner> & T;

// any input that has a primary key
export const Saved = t.exact(t.type({ _id: withMessage(OId, () => 'Invalid id') }));

export type Saved<T = {}> = t.TypeOf<typeof Saved> & T;
