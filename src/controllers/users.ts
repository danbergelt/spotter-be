import express from 'express';
import { path } from '../utils/path';
import { schema } from '../validators';
import { createUser } from '../services/createUser';
import { createPw } from '../services/createPw';
import { verifyJwt } from '../utils/verifiers';
import { resolver } from '../utils/resolver';
import { pipe } from 'fp-ts/lib/pipeable';
import { readUser } from '../services/readUser';
import { chain, fold, fromEither } from 'fp-ts/lib/TaskEither';
import { readPw } from '../services/readPw';
import { of } from 'fp-ts/lib/Task';
import { sendAuth } from '../utils/sendAuth';
import { SyncEither } from '../types';
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
import { mongoify } from '../utils/mongoify';
import { sendError } from '../utils/sendError';
import { validate } from '../services/validate';
import { fromNullable } from 'fp-ts/lib/Either';

// destructured constants
const { TEAM, NO_REPLY, CONTACT } = EMAILS;
const { USERS, CONTACT: CONTACT_SCHEMA } = SCHEMAS;
const { REF_SECRET } = process.env;

// router instance
const r = express.Router();

// compositions
const usersPath = path('/users');
const nullableUser = fromNullable(invalidCredentials());
const nullableCookie = fromNullable(_());

r.post(
  usersPath('/contact'),
  resolver(async ({ body }: Req<Contact>, res) => {
    const { name, email, subject, message } = body;

    return await pipe(
      validate(schema(CONTACT_SCHEMA), body),
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
  })
);

r.post(
  usersPath('/login'),
  resolver(async ({ body, app }: Req<User>, res) => {
    const { password } = body;
    const { db } = app.locals;

    return await pipe(
      validate(schema(USERS), body),
      chain(user => readUser(db, { email: user.email })),
      chain(user => fromEither(nullableUser(user))),
      chain(user => readPw(db, { ...user, password })),
      fold(
        error => of(sendError(error, res)),
        _id => of(sendAuth(_id, res))
      )
    )();
  })
);

r.post(
  usersPath('/registration'),
  resolver(async ({ body, app }: Req<User>, res) => {
    const { password } = body;
    const { db } = app.locals;

    return await pipe(
      validate(schema(USERS), body),
      chain(user => createUser(db, user.email)),
      chain(user => createPw(db, user.insertedId as ObjectID, password)),
      fold(
        error => of(sendError(error, res)),
        _id => of(sendAuth(_id, res))
      )
    )();
  })
);

r.post(
  usersPath('/refresh'),
  resolver(async ({ cookies, app }, res) => {
    const { db } = app.locals;
    const checkCookie = (): SyncEither<string> => nullableCookie(cookies.ref);

    return await pipe(
      fromEither(checkCookie()),
      chain(cookie => fromEither(verifyJwt(cookie, String(REF_SECRET)))),
      chain(jwt => fromEither(mongoify(jwt._id))),
      chain(_id => readUser(db, { _id })),
      chain(user => fromEither(nullableUser(user))),
      fold(
        error => of(res.status(error.status).json(failure({ token: null }))),
        user => of(sendAuth(user._id, res))
      )
    )();
  })
);

r.post(usersPath('/logout'), (_, res) => {
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
});

// TYPES
export interface Contact {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export type User = Pick<Email, 'email'> & Pick<Password, 'password'>;

export default r;
