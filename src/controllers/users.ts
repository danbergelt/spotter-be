import express from 'express';
import { path } from '../utils/path';
import { validate } from '../middleware/validate';
import { schema } from '../validators';
import { createUser } from '../services/createUser';
import { createPw } from '../services/createPw';
import { verifyJwt } from '../utils/verifiers';
import { resolver } from '../utils/resolver';
import { pipe } from 'fp-ts/lib/pipeable';
import { readUser } from '../services/readUser';
import { chain, fold, left, right, chainEitherK } from 'fp-ts/lib/TaskEither';
import { readPw } from '../services/readPw';
import { of, Task } from 'fp-ts/lib/Task';
import { auth } from '../utils/auth';
import { Nullable, HTTPEither } from '../types';
import { ObjectId, ObjectID } from 'mongodb';
import { COOKIE_NAME, EMAILS, SCHEMAS } from '../utils/constants';
import { success, failure } from '../utils/httpResponses';
import { OK } from 'http-status-codes';
import { _ } from '../utils/errors';
import { Req } from '../types';
import { Email, Password } from '../services/user.types';
import { sendMail } from '../services/sendMail';
import { contactConfirmTemplate, contactMessageTemplate } from '../utils/emailTemplates';
import { metadata } from '../utils/metadata';
import { E } from '../utils/e';

const { TEAM, NO_REPLY, CONTACT } = EMAILS;
const { USERS, CONTACT: CONTACT_SCHEMA } = SCHEMAS;
const { REF_SECRET } = process.env;

const r = express.Router();
const usersPath = path('/users');

r.post(
  usersPath('/contact'),
  validate(schema(CONTACT_SCHEMA)),
  resolver(async (req: Req<Contact>, res, next) => {
    const { name, email, subject, message } = req.body;

    const error = (error: E): Task<void> => of(next(error));
    const response = (): Task<void> => {
      res.status(OK).json(success({ message: 'Message sent' }));
      return of(undefined);
    };

    return await pipe(
      // send the message to the official spotter email address
      sendMail(metadata(CONTACT, TEAM, subject, contactMessageTemplate(message, name, email))),
      // confirm the successful delivery and send a no-reply confirmation to the user
      chain(() =>
        sendMail(metadata(NO_REPLY, email, 'Greetings from Spotter', contactConfirmTemplate()))
      ),
      fold(error, response)
    )();
  })
);

r.post(
  usersPath('/login'),
  validate(schema(USERS)),
  resolver(async (req: Req<User>, res, next) => {
    const { email, password } = req.body;
    const { db } = req.app.locals;

    const error = (error: E): Task<void> => of(next(error));
    const response = (_id: ObjectID): Task<void> => auth(_id, res);

    return await pipe(
      // confirm the identity of the email/pw
      readUser(db, { email }),
      chain(user => readPw(db, { ...user, password })),
      fold(error, response)
    )();
  })
);

r.post(
  usersPath('/registration'),
  validate(schema(USERS)),
  resolver(async (req: Req<User>, res, next) => {
    const { email, password } = req.body;
    const { db } = req.app.locals;

    const error = (error: E): Task<void> => of(next(error));
    const response = (_id: ObjectID): Task<void> => auth(_id, res);

    return await pipe(
      // create user and pw docs
      createUser(db, email),
      chain(({ insertedId }) => createPw(db, insertedId as ObjectID, password)),
      fold(error, response)
    )();
  })
);

r.post(
  usersPath('/refresh'),
  resolver(async ({ cookies, app }, res) => {
    const { db } = app.locals;
    const refresh = cookies.ref as Nullable<string>;

    const error = ({ status }: E): Task<void> => {
      res.status(status).json(failure({ token: null }));
      return of(undefined);
    };
    const response = ({ _id }: Email): Task<void> => auth(_id, res);

    return await pipe(
      // if cookie is present, continue, otherwise return an error
      ((): HTTPEither<string> => (refresh ? right(refresh) : left(_())))(),
      // verify the cookie as a JWT and verify the encoded user _id
      chainEitherK(cookie => verifyJwt(cookie, String(REF_SECRET))),
      chain(({ _id }) => readUser(db, { _id: new ObjectId(_id) })),
      fold(error, response)
    )();
  })
);

r.post(usersPath('/logout'), (_, res) => {
  // clear the cookie and return a successful response
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
