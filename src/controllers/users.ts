import express from 'express';
import { path } from '../utils/path';
import { schema } from '../validators';
import { createUser } from '../services/createUser';
import { createPw } from '../services/createPw';
import { verifyJwt } from '../utils/verifiers';
import { resolver } from '../utils/resolver';
import { pipe } from 'fp-ts/lib/pipeable';
import { readUser } from '../services/readUser';
import { chain, fold, left, right, chainEitherK } from 'fp-ts/lib/TaskEither';
import { readPw } from '../services/readPw';
import { of } from 'fp-ts/lib/Task';
import { sendAuth } from '../utils/sendAuth';
import { Nullable, HTTPEither } from '../types';
import { ObjectID } from 'mongodb';
import { COOKIE_NAME, EMAILS, SCHEMAS } from '../utils/constants';
import { success, failure } from '../utils/httpResponses';
import { OK } from 'http-status-codes';
import { _ } from '../utils/errors';
import { Req } from '../types';
import { Email, Password } from '../services/user.types';
import { sendMail } from '../services/sendMail';
import { contactConfirmTemplate, contactMessageTemplate } from '../utils/emailTemplates';
import { metadata } from '../utils/metadata';
import { mongoify } from '../utils/mongoify';
import { sendError } from '../utils/sendError';
import { validate } from '../services/validate';

const { TEAM, NO_REPLY, CONTACT } = EMAILS;
const { USERS, CONTACT: CONTACT_SCHEMA } = SCHEMAS;
const { REF_SECRET } = process.env;

const r = express.Router();
const usersPath = path('/users');

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
      chain(({ email }) => readUser(db, { email })),
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
      chain(({ email }) => createUser(db, email)),
      chain(({ insertedId }) => createPw(db, insertedId as ObjectID, password)),
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
    const refresh = cookies.ref as Nullable<string>;

    return await pipe(
      ((): HTTPEither<string> => (refresh ? right(refresh) : left(_())))(),
      chainEitherK(cookie => verifyJwt(cookie, String(REF_SECRET))),
      chainEitherK(({ _id }) => mongoify(_id)),
      chain(_id => readUser(db, { _id })),
      fold(
        ({ status }) => of(res.status(status).json(failure({ token: null }))),
        ({ _id }) => of(sendAuth(_id, res))
      )
    )();
  })
);

r.post(usersPath('/logout'), (_, res) => {
  pipe(res.clearCookie(COOKIE_NAME), res => res.status(OK).json(success()));
});

export interface Contact {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export type User = Pick<Email, 'email'> & Pick<Password, 'password'>;

export default r;
