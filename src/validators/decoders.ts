import * as t from 'io-ts';
import { withMessage } from 'io-ts-types/lib/withMessage';
import { optional } from 'io-ts-extra';
import { EMAIL_REGEX, DATE_REGEX } from '../utils/constants';
import { ObjectID } from 'mongodb';

const invalid = (x: string): t.StringC => withMessage(t.string, () => `Invalid ${x}`);

interface Date {
  readonly Date: unique symbol;
}

interface Id {
  readonly Id: unique symbol;
}

interface Email {
  readonly Email: unique symbol;
}

interface PW {
  readonly PW: unique symbol;
}

interface Ex {
  readonly Ex: unique symbol;
}

const Date = t.brand(t.string, (d): d is t.Branded<string, Date> => DATE_REGEX.test(d), 'Date');
const OId = t.brand(t.object, (o): o is t.Branded<ObjectID, Id> => o instanceof ObjectID, 'Id');
const Exercise = t.brand(t.string, (e): e is t.Branded<string, Ex> => e.length < 26, 'Ex');
const Email = t.brand(t.string, (e): e is t.Branded<string, Email> => EMAIL_REGEX.test(e), 'Email');
const Password = t.brand(t.string, (p): p is t.Branded<string, PW> => p.length > 5, 'PW');

const EmailString = t.intersection([invalid('email'), withMessage(Email, () => 'Invalid email')]);

const PasswordString = t.intersection([
  invalid('password'),
  withMessage(Password, () => 'Password too short (6 char min)')
]);

const ExerciseString = t.intersection([
  invalid('name'),
  withMessage(Exercise, () => 'Name too long (25 char max)')
]);

export const userDecoder = t.exact(
  t.type({
    email: EmailString,
    password: PasswordString
  })
);

export type User = t.TypeOf<typeof userDecoder>;

export const contactDecoder = t.exact(
  t.type({
    name: invalid('name'),
    email: EmailString,
    subject: invalid('subject'),
    message: invalid('message')
  })
);

export type Contact = t.TypeOf<typeof contactDecoder>;

export const exerciseDecoder = t.exact(
  t.type({
    name: ExerciseString,
    user: withMessage(OId, () => 'Invalid Id'),
    pr: withMessage(optional(t.number), () => 'Invalid pr'),
    prDate: withMessage(optional(Date), () => 'Invalid pr date')
  })
);

export type Exercise = t.TypeOf<typeof exerciseDecoder>;

export const Owner = t.exact(t.type({ user: withMessage(OId, () => 'Invalid id') }));
export type Owned<T = {}> = t.TypeOf<typeof Owner> & T;

export const Saved = t.exact(t.type({ _id: withMessage(OId, () => 'Invalid id') }));
export type Saved<T = {}> = t.TypeOf<typeof Saved> & T;
