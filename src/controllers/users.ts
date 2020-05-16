import { schema } from '../validators';
import { createUser } from '../services/createUser';
import { resolver, Fn } from '../utils/resolver';
import { pipe } from 'fp-ts/lib/pipeable';
import { readUser } from '../services/readUser';
import { chain, fold, fromEither, right, left, map } from 'fp-ts/lib/TaskEither';
import { of } from 'fp-ts/lib/Task';
import { sendAuth } from '../utils/sendAuth';
import { COOKIE_NAME, EMAILS, SCHEMAS } from '../utils/constants';
import { success, failure } from '../utils/httpResponses';
import { OK } from 'http-status-codes';
import { _, invalidCredentials } from '../utils/errors';
import { Req } from '../types';
import { sendMail } from '../services/sendMail';
import { confirmContactMsg, contactMsg } from '../utils/emailTemplates';
import { metadata } from '../utils/metadata';
import { sendError } from '../utils/sendError';
import { validate } from '../services/validate';
import { fromNullable } from 'fp-ts/lib/Either';
import { digestToken } from '../utils/digestToken';
import { encrypt } from '../utils/encrypt';
import { verifyEncryption } from '../utils/verifiers';
import { parseWrite } from '../utils/parseWrite';

// destructured constants
const { REF_SECRET } = process.env;
const { TEAM, NO_REPLY, CONTACT } = EMAILS;
const { USERS, CONTACT: CONTACT_SCHEMA } = SCHEMAS;

// compositions
const isUserNull = fromNullable(invalidCredentials());
const isCookieNull = fromNullable(_());

export const contact = resolver(async (req: Req<Contact>, res) => {
  const { name, email, subject, message } = req.body;

  return await pipe(
    validate(schema(CONTACT_SCHEMA), req.body),
    chain(() => sendMail(metadata(CONTACT, TEAM, subject, contactMsg(message, name, email)))),
    chain(() => sendMail(metadata(NO_REPLY, email, 'Greetings from Spotter', confirmContactMsg()))),
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
    chain(user =>
      pipe(
        verifyEncryption(password, user.password),
        chain(verified => (verified ? right(user) : left(invalidCredentials())))
      )
    ),
    fold(
      error => of(sendError(error, res)),
      user => of(sendAuth(user._id, res))
    )
  )();
});

export const registration = resolver(async (req: Req<User>, res) => {
  const { db } = req.app.locals;

  return await pipe(
    validate(schema(USERS), req.body),
    chain(user => encrypt(user.password)),
    chain(password => createUser(db, { ...req.body, password })),
    map(write => parseWrite<User>(write)),
    fold(
      error => of(sendError(error, res)),
      user => of(sendAuth(user._id, res))
    )
  )();
});

export const refresh = resolver(async (req, res) => {
  const { db } = req.app.locals;
  const cookie: string | null = req.cookies.ref;

  return await pipe(
    fromEither(isCookieNull(cookie)),
    chain(cookie => digestToken(cookie, db, String(REF_SECRET))),
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

export interface User {
  email: string;
  password: string;
}
