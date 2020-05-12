import { schema } from '../validators';
import { createUser } from '../services/createUser';
import { createPw } from '../services/createPw';
import { resolver, Fn } from '../utils/resolver';
import { pipe } from 'fp-ts/lib/pipeable';
import { readUser } from '../services/readUser';
import { chain, fold, fromEither } from 'fp-ts/lib/TaskEither';
import { readPw } from '../services/readPw';
import { of } from 'fp-ts/lib/Task';
import { sendAuth } from '../utils/sendAuth';
import { ObjectID } from 'mongodb';
import { COOKIE_NAME, EMAILS, SCHEMAS } from '../utils/constants';
import { success, failure } from '../utils/httpResponses';
import { OK } from 'http-status-codes';
import { _, invalidCredentials } from '../utils/errors';
import { Req } from '../types';
import { Email, Password } from '../services/user.types';
import { sendMail } from '../services/sendMail';
import { contactConfirmTemplate, contactMessageTemplate } from '../utils/emailTemplates';
import { metadata } from '../utils/metadata';
import { sendError } from '../utils/sendError';
import { validate } from '../services/validate';
import { fromNullable } from 'fp-ts/lib/Either';
import { digestToken } from 'src/utils/digestToken';

// destructured constants
const { TEAM, NO_REPLY, CONTACT } = EMAILS;
const { USERS, CONTACT: CONTACT_SCHEMA } = SCHEMAS;

// compositions
const isUserNull = fromNullable(invalidCredentials());
const isCookieNull = fromNullable(_());

export const contact = resolver(async (req: Req<Contact>, res) => {
  const { name, email, subject, message } = req.body;

  return await pipe(
    validate(schema(CONTACT_SCHEMA), req.body),
    chain(() =>
      sendMail(metadata(CONTACT, TEAM, subject, contactMessageTemplate(message, name, email)))
    ),
    chain(() =>
      sendMail(metadata(NO_REPLY, email, 'Greetings from Spotter', contactConfirmTemplate()))
    ),
    fold(
      error => of(sendError(error, res)),
      () => of(res.status(OK).json(success({ message: 'Message sent' })))
    )
  )();
});

export const login = resolver(async (req: Req<User>, res) => {
  const { password } = req.body;
  const { db } = req.app.locals;

  return await pipe(
    validate(schema(USERS), req.body),
    chain(user => readUser(db, { email: user.email })),
    chain(user => fromEither(isUserNull(user))),
    chain(user => readPw(db, { ...user, password })),
    fold(
      error => of(sendError(error, res)),
      _id => of(sendAuth(_id, res))
    )
  )();
});

export const registration = resolver(async (req: Req<User>, res) => {
  const { password } = req.body;
  const { db } = req.app.locals;

  return await pipe(
    validate(schema(USERS), req.body),
    chain(user => createUser(db, user.email)),
    chain(user => createPw(db, user.insertedId as ObjectID, password)),
    fold(
      error => of(sendError(error, res)),
      _id => of(sendAuth(_id, res))
    )
  )();
});

export const refresh = resolver(async (req, res) => {
  const { db } = req.app.locals;
  const cookie: string | null = req.cookies.ref;

  return await pipe(
    fromEither(isCookieNull(cookie)),
    chain(cookie => digestToken(cookie, db)),
    fold(
      error => of(res.status(error.status).json(failure({ token: null }))),
      user => of(sendAuth(user._id, res))
    )
  )();
});

export const logout: Fn = (_, res) =>
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));

// TYPES
export interface Contact {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export type User = Pick<Email, 'email'> & Pick<Password, 'password'>;
